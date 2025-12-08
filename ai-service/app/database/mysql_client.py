import pymysql
from typing import Optional
from functools import lru_cache
from app.config import get_settings


class MySQLClient:
    """MySQL database client for querying product and order data."""
    
    def __init__(self):
        self.settings = get_settings()
        self._connection: Optional[pymysql.connections.Connection] = None
    
    def _get_connection(self) -> pymysql.connections.Connection:
        """Get or create database connection."""
        if self._connection is None or not self._connection.open:
            self._connection = pymysql.connect(
                host=self.settings.mysql_host,
                port=self.settings.mysql_port,
                database=self.settings.mysql_database,
                user=self.settings.mysql_user,
                password=self.settings.mysql_password,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor
            )
        return self._connection
    
    def test_connection(self) -> bool:
        """Test if database connection is working."""
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1")
            return True
        except Exception:
            return False
    
    def get_all_products(self) -> list[dict]:
        """Fetch all products with category information."""
        conn = self._get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    p.id,
                    p.name,
                    p.slug,
                    p.description,
                    p.price,
                    p.stock,
                    p.status,
                    c.name as category_name,
                    c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.status = 'Còn hàng'
            """)
            return cursor.fetchall()
    
    def get_product_by_id(self, product_id: int) -> Optional[dict]:
        """Fetch a single product by ID."""
        conn = self._get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    p.id,
                    p.name,
                    p.slug,
                    p.description,
                    p.price,
                    p.stock,
                    p.status,
                    c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = %s
            """, (product_id,))
            return cursor.fetchone()
    
    def get_best_sellers(self, limit: int = 5) -> list[dict]:
        """Get top selling products."""
        conn = self._get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    p.id,
                    p.name,
                    p.price,
                    p.stock,
                    c.name as category_name,
                    COALESCE(SUM(oi.quantity), 0) as total_rented
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN order_items oi ON p.id = oi.product_id
                GROUP BY p.id, p.name, p.price, p.stock, c.name
                ORDER BY total_rented DESC
                LIMIT %s
            """, (limit,))
            return cursor.fetchall()
    
    def get_user_orders(self, user_id: int, limit: int = 5) -> list[dict]:
        """Get recent orders for a user."""
        conn = self._get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    o.id,
                    o.status,
                    o.total_amount,
                    o.start_date,
                    o.end_date,
                    o.created_at
                FROM orders o
                WHERE o.user_id = %s
                ORDER BY o.created_at DESC
                LIMIT %s
            """, (user_id, limit))
            orders = cursor.fetchall()
            
            # Get items for each order
            for order in orders:
                cursor.execute("""
                    SELECT 
                        oi.quantity,
                        oi.price,
                        p.name as product_name
                    FROM order_items oi
                    JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = %s
                """, (order['id'],))
                order['items'] = cursor.fetchall()
            
            return orders
    
    def get_order_status(self, order_id: int, user_id: int) -> Optional[dict]:
        """Get status of a specific order."""
        conn = self._get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    o.id,
                    o.status,
                    o.total_amount,
                    o.start_date,
                    o.end_date,
                    o.address,
                    o.created_at
                FROM orders o
                WHERE o.id = %s AND o.user_id = %s
            """, (order_id, user_id))
            return cursor.fetchone()
    
    def check_product_stock(self, product_id: int) -> Optional[dict]:
        """Check stock availability for a product."""
        conn = self._get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    id,
                    name,
                    stock,
                    status
                FROM products
                WHERE id = %s
            """, (product_id,))
            return cursor.fetchone()
    
    def search_products(self, query: str, limit: int = 10) -> list[dict]:
        """Search products by name or description."""
        conn = self._get_connection()
        with conn.cursor() as cursor:
            search_pattern = f"%{query}%"
            cursor.execute("""
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.stock,
                    c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.status = 'active'
                  AND (p.name LIKE %s OR p.description LIKE %s)
                LIMIT %s
            """, (search_pattern, search_pattern, limit))
            return cursor.fetchall()
    
    def close(self):
        """Close database connection."""
        if self._connection and self._connection.open:
            self._connection.close()
            self._connection = None


@lru_cache()
def get_mysql_client() -> MySQLClient:
    """Get cached MySQL client instance."""
    return MySQLClient()

import chromadb
from typing import Optional
from functools import lru_cache
from app.config import get_settings
from app.database import get_mysql_client


class ChromaVectorStore:
    """ChromaDB vector store for product embeddings."""
    
    COLLECTION_NAME = "rerent_products"
    
    def __init__(self):
        self.settings = get_settings()
        self._client: Optional[chromadb.PersistentClient] = None
        self._collection = None
    
    def _get_client(self) -> chromadb.PersistentClient:
        """Get or create ChromaDB persistent client."""
        if self._client is None:
            self._client = chromadb.PersistentClient(
                path=self.settings.chroma_persist_directory
            )
        return self._client
    
    def _get_collection(self):
        """Get or create the products collection."""
        if self._collection is None:
            client = self._get_client()
            self._collection = client.get_or_create_collection(
                name=self.COLLECTION_NAME,
                metadata={"description": "ReRent product embeddings for RAG"},
            )
        return self._collection
    
    def is_ready(self) -> bool:
        """Check if vector store is ready."""
        try:
            collection = self._get_collection()
            return collection is not None
        except Exception as e:
            print(f"[ERROR] VectorStore not ready: {e}")
            return False
    
    def get_product_count(self) -> int:
        """Get number of products in vector store."""
        try:
            collection = self._get_collection()
            return collection.count()
        except Exception:
            return 0
    
    def sync_products(self) -> int:
        """Sync products from MySQL to ChromaDB."""
        mysql_client = get_mysql_client()
        products = mysql_client.get_all_products()
        
        print(f"[DEBUG] Fetched {len(products)} products from MySQL")
        
        if not products:
            return 0
        
        collection = self._get_collection()
        
        # Clear existing data
        existing_ids = collection.get()["ids"]
        if existing_ids:
            collection.delete(ids=existing_ids)
        
        # Prepare data for insertion
        documents = []
        metadatas = []
        ids = []
        
        for product in products:
            # Create document text for embedding
            doc_text = self._create_product_document(product)
            documents.append(doc_text)
            
            # Store metadata
            metadatas.append({
                "product_id": product["id"],
                "name": product["name"],
                "price": float(product["price"]) if product["price"] else 0,
                "stock": product["stock"] or 0,
                "category": product["category_name"] or "Chưa phân loại",
                "status": product["status"] or "active"
            })
            
            ids.append(f"product_{product['id']}")
        
        # Add to collection (auto-persists with PersistentClient)
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"[DEBUG] Added {len(products)} products to ChromaDB")
        
        return len(products)
    
    def _create_product_document(self, product: dict) -> str:
        """Create a text document from product data for embedding."""
        parts = [
            f"Tên sản phẩm: {product['name']}",
        ]
        
        if product.get('description'):
            parts.append(f"Mô tả: {product['description']}")
        
        if product.get('category_name'):
            parts.append(f"Danh mục: {product['category_name']}")
        
        if product.get('price'):
            price_formatted = f"{float(product['price']):,.0f}₫"
            parts.append(f"Giá thuê: {price_formatted}")
        
        if product.get('stock'):
            parts.append(f"Số lượng còn: {product['stock']}")
        
        return "\n".join(parts)
    
    def search_similar(self, query: str, n_results: int = 5) -> list[dict]:
        """Search for similar products based on query."""
        collection = self._get_collection()
        
        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )
        
        similar_products = []
        if results and results["metadatas"]:
            for i, metadata in enumerate(results["metadatas"][0]):
                similar_products.append({
                    "product_id": metadata.get("product_id"),
                    "name": metadata.get("name"),
                    "price": metadata.get("price"),
                    "stock": metadata.get("stock"),
                    "category": metadata.get("category"),
                    "document": results["documents"][0][i] if results["documents"] else "",
                    "distance": results["distances"][0][i] if results["distances"] else None
                })
        
        return similar_products


@lru_cache()
def get_vectorstore() -> ChromaVectorStore:
    """Get cached ChromaVectorStore instance."""
    return ChromaVectorStore()

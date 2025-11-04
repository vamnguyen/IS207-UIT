"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Search,
  AlertCircle,
  RefreshCw,
  Compass,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
      <div className="container mx-auto text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            {/* Large 404 Text */}
            <motion.h1
              className="text-8xl md:text-9xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              404
            </motion.h1>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -left-4"
              animate={{
                rotate: [0, -15, 15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Search className="h-6 w-6 text-blue-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã được di
            chuyển. Đừng lo lắng, chúng tôi sẽ giúp bạn tìm đường về nhà!
          </p>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
        >
          {/* Go Home Card */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Card className="h-full border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  className="mb-4 flex justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Về trang chủ</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Quay lại trang chủ để khám phá các sản phẩm tuyệt vời
                </p>
                <Link href="/">
                  <Button className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Trang chủ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Go Back Card */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Card className="h-full border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  className="mb-4 flex justify-center"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <ArrowLeft className="h-6 w-6 text-secondary" />
                  </div>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Quay lại</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sử dụng nút quay lại của trình duyệt để quay lại trang trước
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Refresh Card */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Card className="h-full border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  className="mb-4 flex justify-center"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-green-500" />
                  </div>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Tải lại trang</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Thử tải lại trang để xem có khắc phục được lỗi không
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tải lại
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-0 shadow-lg bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Compass className="h-6 w-6 text-primary mr-2" />
                <h3 className="font-semibold text-lg">Cần hỗ trợ thêm?</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Nếu bạn vẫn gặp khó khăn, hãy thử:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Kiểm tra lại URL có đúng không
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Thử tìm kiếm sản phẩm từ trang chủ
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Liên hệ với chúng tôi nếu cần hỗ trợ
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/5"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-secondary/5"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-20 h-20 rounded-full bg-accent/5"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}

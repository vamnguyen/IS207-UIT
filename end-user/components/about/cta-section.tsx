"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export function CTASection() {
  const router = useRouter();
  return (
    <motion.section
      className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng làm việc cùng chúng tôi?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi để cùng tạo ra những sản phẩm tuyệt vời
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              className="inline-block border-0 shadow-lg bg-card/50 backdrop-blur-sm cursor-pointer"
              onClick={() => router.push("/contact")}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-4">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span className="text-lg font-medium">Liên hệ ngay</span>
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

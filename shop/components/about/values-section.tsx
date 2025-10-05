"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Zap, Target } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Tận tâm với khách hàng",
    description:
      "Chúng tôi luôn đặt trải nghiệm khách hàng lên hàng đầu trong mọi quyết định.",
  },
  {
    icon: Shield,
    title: "Đáng tin cậy",
    description:
      "Cam kết bảo vệ quyền lợi và thông tin của khách hàng một cách tuyệt đối.",
  },
  {
    icon: Zap,
    title: "Đổi mới sáng tạo",
    description: "Không ngừng cải tiến công nghệ để mang đến dịch vụ tốt nhất.",
  },
  {
    icon: Target,
    title: "Hiệu quả cao",
    description:
      "Tối ưu hóa quy trình để tiết kiệm thời gian và chi phí cho khách hàng.",
  },
];

export function ValuesSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Giá trị cốt lõi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Những nguyên tắc định hướng mọi hành động và quyết định của chúng
            tôi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <value.icon className="h-7 w-7" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-pretty">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

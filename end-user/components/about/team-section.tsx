"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    role: "CEO & Founder",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-asian-male-ceo-4KkMpPLjSOMAVGnbB8QBHCtumXIzuv.jpg",
    bio: "10 năm kinh nghiệm trong lĩnh vực công nghệ và kinh doanh",
    social: {
      linkedin: "#",
      github: "#",
      email: "an@renthub.vn",
    },
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    role: "CTO",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-asian-female-developer-lw152KPHzIk5rRY8xkxeFsoKmSEN9A.jpg",
    bio: "Chuyên gia về kiến trúc hệ thống và phát triển phần mềm",
    social: {
      linkedin: "#",
      github: "#",
      email: "binh@renthub.vn",
    },
  },
  {
    id: 3,
    name: "Lê Minh Cường",
    role: "Lead Developer",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-asian-male-developer-6asnyIvOdybDFlfjnAiL230jNzwSr7.jpg",
    bio: "Đam mê xây dựng trải nghiệm người dùng tuyệt vời",
    social: {
      linkedin: "#",
      github: "#",
      email: "cuong@renthub.vn",
    },
  },
  {
    id: 4,
    name: "Phạm Thu Dung",
    role: "Product Manager",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-asian-female-manager-7KMIyKWgq2Tg3eSTJKP4YCr3gV4Q5f.jpg",
    bio: "Chuyên gia về quản lý sản phẩm và chiến lược kinh doanh",
    social: {
      linkedin: "#",
      github: "#",
      email: "dung@renthub.vn",
    },
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    role: "UI/UX Designer",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-asian-male-designer-MoJSUiYRSeoBUZ5Mdy2FrRTX7slSg1.jpg",
    bio: "Tạo ra những thiết kế đẹp mắt và dễ sử dụng",
    social: {
      linkedin: "#",
      github: "#",
      email: "em@renthub.vn",
    },
  },
  {
    id: 6,
    name: "Đỗ Thị Phương",
    role: "Marketing Lead",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-asian-female-marketing-Pz9WioW4eRPJqcMR4vw8AJ2R01qFH4.jpg",
    bio: "Chuyên gia về marketing số và phát triển thương hiệu",
    social: {
      linkedin: "#",
      github: "#",
      email: "phuong@renthub.vn",
    },
  },
  {
    id: 7,
    name: "Vũ Đức Giang",
    role: "Customer Success",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-asian-male-support-lFKzAex6d3UpZAqAIt1lnmm49HthXc.jpg",
    bio: "Đảm bảo trải nghiệm khách hàng luôn hoàn hảo",
    social: {
      linkedin: "#",
      github: "#",
      email: "giang@renthub.vn",
    },
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TeamSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Đội ngũ của chúng tôi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Gặp gỡ những con người tài năng đang xây dựng tương lai của ngành
            cho thuê tại Việt Nam
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={item}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  >
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-10 w-10 bg-white/90 hover:bg-white"
                        asChild
                      >
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-10 w-10 bg-white/90 hover:bg-white"
                        asChild
                      >
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-10 w-10 bg-white/90 hover:bg-white"
                        asChild
                      >
                        <a href={`mailto:${member.social.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

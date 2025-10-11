"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    id: 1,
    name: "Trần Ngọc Quỳnh Hoa",
    role: "Co-founder",
    image:
      "https://com62647.wordpress.com/wp-content/uploads/2025/10/z7068339402421_513246101948e5f7eda204c8a33cb454-1-edited.jpg",
    bio: "10 năm kinh nghiệm trong lĩnh vực công nghệ và kinh doanh",
    social: {
      linkedin: "#",
      github: "#",
      email: "hoa.tran@rerent.vn",
    },
  },
  {
    id: 2,
    name: "Nguyễn Bảo Như",
    role: "Co-founder",
    image:
      "https://com62647.wordpress.com/wp-content/uploads/2025/10/z7069773343973_f08fd198d00e041c51840f24f782c74f-1-edited.jpg",
    bio: "Chuyên gia về kiến trúc hệ thống và phát triển phần mềm",
    social: {
      linkedin: "#",
      github: "#",
      email: "nhu.nguyen@rerent.vn",
    },
  },
  {
    id: 3,
    name: "Huỳnh Lâm Tâm Như",
    role: "Co-founder",
    image:
      "https://com62647.wordpress.com/wp-content/uploads/2025/10/z7068227179672_8ff50be645ed46ba464f37af7d5f044b-edited.jpg",
    bio: "Đam mê xây dựng trải nghiệm người dùng tuyệt vời",
    social: {
      linkedin: "#",
      github: "#",
      email: "nhu.huynh@rerent.vn",
    },
  },
  {
    id: 4,
    name: "Nguyễn Minh Long",
    role: "Co-founder",
    image:
      "https://com62647.wordpress.com/wp-content/uploads/2025/10/z7068216645955_923f9efc4ba9140a0f3d1b2440b610c6-edited.jpg",
    bio: "Chuyên gia về quản lý sản phẩm và chiến lược kinh doanh",
    social: {
      linkedin: "#",
      github: "#",
      email: "long.nguyen@rerent.vn",
    },
  },
  {
    id: 5,
    name: "Nguyễn Viết Anh Minh",
    role: "Co-founder",
    image: "https://avatars.githubusercontent.com/u/120087002?v=4",
    bio: "Tạo ra những thiết kế đẹp mắt và dễ sử dụng",
    social: {
      linkedin: "#",
      github: "#",
      email: "minh.nguyen@rerent.vn",
    },
  },
  {
    id: 6,
    name: "Tô Hoàng Nhật",
    role: "Co-founder",
    image: "https://avatars.githubusercontent.com/u/145257227?v=4",
    bio: "Chuyên gia về marketing số và phát triển thương hiệu",
    social: {
      linkedin: "#",
      github: "#",
      email: "nhat.to@rerent.vn",
    },
  },
  {
    id: 7,
    name: "Đinh Khánh Đăng",
    role: "Co-founder",
    image: "https://avatars.githubusercontent.com/u/157336690?v=4",
    bio: "Đảm bảo trải nghiệm khách hàng luôn hoàn hảo",
    social: {
      linkedin: "#",
      github: "#",
      email: "dang.dinh@rerent.vn",
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
                        className="rounded-full h-10 w-10 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black"
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
                        className="rounded-full h-10 w-10 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black"
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
                        className="rounded-full h-10 w-10 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black"
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

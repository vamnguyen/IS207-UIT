import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Package, Award } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Package,
      value: "1,000+",
      label: "Sản phẩm đa dạng",
      description: "Từ công nghệ đến gia dụng",
    },
    {
      icon: Users,
      value: "5,000+",
      label: "Khách hàng tin tưởng",
      description: "Trên toàn quốc",
    },
    {
      icon: TrendingUp,
      value: "99%",
      label: "Tỷ lệ hài lòng",
      description: "Dịch vụ chất lượng cao",
    },
    {
      icon: Award,
      value: "24/7",
      label: "Hỗ trợ khách hàng",
      description: "Luôn sẵn sàng phục vụ",
    },
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">
            Tại sao chọn ReRent?
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm thuê đồ tốt nhất với dịch vụ
            chuyên nghiệp và đáng tin cậy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center rounded-2xl border-0 bg-background/60 backdrop-blur"
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-lg">{stat.label}</div>
                    <div className="text-sm text-muted-foreground text-pretty">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

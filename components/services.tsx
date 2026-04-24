import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, MessageCircle, TrendingUp, Users } from "lucide-react"

const services = [
  {
    icon: Megaphone,
    title: "Marketing",
    description: "Growth strategy on social media platforms.",
  },
  {
    icon: MessageCircle,
    title: "Fan Messaging",
    description: "Professional chat team managing conversations.",
  },
  {
    icon: TrendingUp,
    title: "Account Growth",
    description: "Optimised pricing and content strategy.",
  },
  {
    icon: Users,
    title: "Traffic",
    description: "Targeted traffic acquisition.",
  },
]

export function Services() {
  return (
    <section className="py-24 px-[10%] text-center bg-black text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Services</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {services.map((service) => {
          const Icon = service.icon

          return (
            <Card
              key={service.title}
              className="w-[280px] bg-card border-border hover:border-primary/50 transition-colors"
             >
              <CardHeader className="pb-2">
                <Icon className="w-10 h-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          )
        })}
        
      </div>
    </section>
  )
}

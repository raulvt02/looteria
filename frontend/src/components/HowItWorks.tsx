import { Upload, Users, ShoppingCart } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "1. Crea tu publicación",
      description: "Sube fotos y describe tus videojuegos o artículos de colección que quieres vender o intercambiar.",
      color: "from-primary to-blue-600",
    },
    {
      icon: Users,
      title: "2. Conecta con coleccionistas",
      description: "Explora el catálogo, encuentra lo que buscas y contacta con otros usuarios para negociar.",
      color: "from-blue-600 to-purple-600",
    },
    {
      icon: ShoppingCart,
      title: "3. Compra o intercambia",
      description: "Realiza transacciones seguras con pago protegido o propón intercambios justos.",
      color: "from-purple-600 to-pink-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 text-4xl font-bold mb-4">
            ¿Cómo funciona Looteria?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Una plataforma simple y segura para comprar, vender e intercambiar tus coleccionables favoritos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-gray-900 text-xl font-bold mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
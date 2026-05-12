import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import toyotaCar from "@/assets/hilux.png";
import logoT from "@/assets/logoT.png";
import corolla from "@/assets/corolla.png";
import yaris from "@/assets/yarisseda.png";


const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const carImages = [toyotaCar, corolla, yaris];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="bg-black border-b-4 border-red-600">
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img
          src={logoT}
          alt="Toyota Logo"
          className="w-10 h-10 object-contain"
/>
            <span className="text-lg text-white font-bold tracking-wide">TOYOTA ACE</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="hidden sm:inline text-white text-muted-foreground hover:text-foreground cursor-pointer transition-colors-red">
              Garantia Toyota 10
            </span>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/login")}
            className="text-white"
          >
             Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero with geometric shapes */}
      <header className="relative overflow-hidden bg-background">
        {/* Geometric background */}
        <div className="absolute inset-0">
          {/* Dark navy triangle - left */}
          <div
            className="absolute top-0 left-0 w-[60%] h-full"
            style={{
              background: "hsl(220 30% 15%)",
              clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)",
            }}
          />
          {/* Red accent triangle */}
          <div
            className="absolute top-0 left-[15%] w-[45%] h-full"
            style={{
              background: "hsl(var(--toyota-red))",
              clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)",
            }}
          />
          {/* Dark black triangle - top right overlap */}
          <div
            className="absolute top-0 right-0 w-[55%] h-full"
            style={{
              background: "hsl(0 0% 5%)",
              clipPath: "polygon(40% 0, 100% 0, 100% 100%, 10% 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              TOYOTA ACE
            </h1>
            <p className="text-2xl md:text-4xl font-bold text-white/90 mt-1 leading-tight">
              ACESSIBILIDADE
              <br />
              CONECTIVIDADE
              <br />
              EXPERIÊNCIA
            </p>
          </div>
        </div>
      </header>

      {/* History section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Car carousel */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => setCurrentSlide((s) => (s === 0 ? carImages.length - 1 : s - 1))}
              className="absolute left-0 z-10 w-10 h-10 rounded-full border border-border bg-background/80 flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <img
              src={carImages[currentSlide]}
              alt="Toyota veículo"
              width={800}
              height={600}
              className="w-full max-w-md h-auto object-contain"
            />
            <button
              onClick={() => setCurrentSlide((s) => (s === carImages.length - 1 ? 0 : s + 1))}
              className="absolute right-0 z-10 w-10 h-10 rounded-full border border-border bg-background/80 flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* History text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-toyota-red mb-6">
              A História da Toyota
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Fundada em 1937, a Toyota revolucionou a indústria automotiva com
              inovação, qualidade e tecnologia sustentável. Seus veículos se tornaram
              sinônimo de confiança, durabilidade e modernidade.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Desde os clássicos até os modelos híbridos e elétricos, a Toyota segue
              transformando o futuro da mobilidade com responsabilidade e excelência.
            </p>
          </div>
        </div>
      </section>

      {/* Why use the app */}
      <section className="bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Por que usar o aplicativo?
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                O <strong className="text-foreground">TOYOTA ACE</strong> é a solução ideal para quem quer
                acompanhar seu carro com facilidade e praticidade.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Criado com foco na sua jornada como cliente, ele reúne três pilares essenciais.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Com o <strong className="text-foreground">TOYOTA ACE</strong>, você acompanha seu pedido em
                tempo real, recebe atualizações importantes e vive uma experiência digital
                completa, onde quer que esteja.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4">
              {["Acessibilidade", "Conectividade", "Experiência"].map((pillar) => (
                <div
                  key={pillar}
                  className="text-right md:text-left font-semibold text-lg text-toyota-red"
                >
                  {pillar}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base" onClick={() => navigate("/cadastro")}>
              Começar agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base" onClick={() => navigate("/login")}>
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-black border-t border-border py-6 px-6 text-center text-white text-sm text-muted-foreground">
        © {new Date().getFullYear()} Toyota do Brasil — Todos os direitos reservados
      </footer>
    </div>
  );
};

export default LandingPage;

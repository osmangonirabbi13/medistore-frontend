import Image from "next/image";

type Brand = {
  id: number;
  name: string;
  logo: string;
};

const brands: Brand[] = [
  {
    id: 1,
    name: " Beximco Pharmaceuticals",
    logo: "https://dummyimage.com/220x80/ffffff/111111&text= Beximco PharmaceuticalsE",
  },
  {
    id: 2,
    name: "Square Pharmaceuticals",
    logo: "https://dummyimage.com/220x80/ffffff/2563eb&text=Square Pharmaceuticals",
  },
  {
    id: 3,
    name: " ACME Laboratories",
    logo: "https://dummyimage.com/220x80/ffffff/dc2626&text= ACME Laboratories",
  },
  {
    id: 4,
    name: " Renata Limited",
    logo: "https://dummyimage.com/220x80/ffffff/0284c7&text= Renata Limited",
  },
  {
    id: 5,
    name: "ACI Healthcare",
    logo: "https://dummyimage.com/220x80/ffffff/0f172a&text=ACI Healthcare",
  },
  {
    id: 6,
    name: "Incepta Pharmaceuticals",
    logo: "https://dummyimage.com/220x80/ffffff/111111&text=Incepta Pharmaceuticals",
  },
];

export default function OurBrands() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Our Brands</h2>
          <p className="mt-2 text-muted-foreground">
            Trusted by industry leaders worldwide
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="rounded-2xl border bg-background px-6 py-8 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col items-center justify-center gap-5">
                {/* Logo */}
                <div className="relative h-14 w-full">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    sizes="200px"
                  />
                </div>

                {/* Name */}
                <p className="text-sm font-medium">{brand.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "Patient",
    feedback:
      "I received my medicines within 24 hours. The packaging was secure and everything was authentic. Truly reliable service!",
    rating: 4.9,
    image: "/users/user1.jpg",
  },
  {
    name: "Tanvir Ahmed",
    role: "Regular Customer",
    feedback:
      "Managing my parents' prescriptions has never been easier. Quick delivery and great customer support every time.",
    rating: 5.0,
    image: "/users/user2.jpg",
  },
  {
    name: "Dr. Nusrat Karim",
    role: "Healthcare Professional",
    feedback:
      "The platform ensures verified products and proper storage conditions. I confidently recommend it to my patients.",
    rating: 4.8,
    image: "/users/user4.jpg",
  },
  {
    name: "Mahmud Hasan",
    role: "Customer",
    feedback:
      "Affordable prices and genuine medicines. The order tracking system keeps me informed at every step.",
    rating: 4.7,
    image: "/users/user3.jpg",
  },
  {
    name: "Farhana Sultana",
    role: "Patient",
    feedback:
      "I was worried about getting authentic medicines online, but this pharmacy exceeded my expectations.",
    rating: 4.9,
    image: "/users/user5.jpg",
  },
  {
    name: "Rafiq Islam",
    role: "Customer",
    feedback:
      "Fast delivery, easy prescription upload, and responsive support team. Highly recommended for anyone needing regular medication.",
    rating: 5.0,
    image: "/users/user6.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="my-10 md:my-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="py-14 bg-cyan-50 rounded-xl">
          <div className="text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Success Stories
            </h2>

            <p className="text-gray-600 mb-10">
              Hear from our thriving community of sellers and satisfied buyers
            </p>

            <Marquee autoFill pauseOnHover speed={50}>
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="mx-4 w-[320px] md:w-[420px] bg-white shadow-md rounded-xl"
                >
                  <CardContent className="flex flex-col items-center p-6">
                    {/* Avatar */}
                    <Avatar className="w-16 h-16 mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    </Avatar>

                    {/* Name */}
                    <h3 className="text-lg font-semibold">
                      {testimonial.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>

                    {/* Feedback */}
                    <p className="text-gray-700 text-base font-medium line-clamp-3 my-4 text-center">
                      &quot;{testimonial.feedback}&quot;
                    </p>

                    {/* Rating */}
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(testimonial.rating)
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}

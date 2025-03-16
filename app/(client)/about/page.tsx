
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
  
      
      <section className="py-4 bg-light-blue">
        <Container className="flex justify-between items-center">
          <h5 className="text-primary">About Us</h5>
          <nav>
            <ol className="breadcrumb m-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-blue-600">HOME</a>
              </li>
            </ol>
          </nav>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-primary text-2xl font-bold mb-3">
                Who We Are
              </h3>
              <p className="text-gray-700">
                Welcome to GServeTech Inc, your trusted partner in eCommerce and
                affiliate marketing. We specialize in providing top-quality
                products and services, connecting customers with the best deals,
                and helping businesses grow through strategic partnerships.
              </p>
              <p className="text-gray-700">
                At GServeTech, our mission is to create a win-win ecosystem for
                both consumers and businesses, focusing on innovation,
                transparency, and customer satisfaction.
              </p>
            </div>
            <div>
              <Image
                src="/Images/office-1.jpg"
                width={500} // Adjust as needed
                height={300} // Adjust as needed
                className="rounded-lg shadow-lg"
                alt="Our Office"
              />
            </div>
          </div>
        </Container>
      </section>

      <Footer /> {/* ✅ Include the Footer */}
    </>
  );
}

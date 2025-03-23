import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <section className="py-4 bg-light-blue">
        <Container className="flex justify-between items-center">
          <h5 className="text-primary">Contact Us</h5>
          <nav>
            <Link href="/" className="text-blue-600">
              HOME
            </Link>
          </nav>
        </Container>
      </section>
      <section className="py-5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-primary text-2xl font-bold mb-3">
                Get In Touch
              </h3>
              <p className="text-gray-700">
                Feel free to contact us anytime. We will get back to you as soon
                as we can!
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="border rounded p-2 w-full"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Your Query"
                  className="border rounded p-2 w-full"
                ></textarea>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="bg-dark text-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold">Contact Info</h3>
              <p>
                Email:{" "}
                <a href="mailto:info@gservetech.com" className="text-blue-400">
                  info@gservetech.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:(416) 635-0502" className="text-blue-400">
                  (416) 635-0502
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

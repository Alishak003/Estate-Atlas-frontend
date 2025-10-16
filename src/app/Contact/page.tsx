import ContactForm from "@/components/AffiliateContact/ContactForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Contact = () => {
  return (
   <section>

        <Navbar/>
     <div className="min-h-screen  relative overflow-hidden mb-10">
      <div className="md:container mx-auto  md:mb-6 mb-7 md:p-8 p-2 text-[#0A1532] text-center">
        <h1 className="md:text-6xl text-4xl mt-16 text-center  font-semibold">
          Reach Out <span className="text-[#3BA1DF]">–</span> To Our <br /> Real Estate Experts
        </h1>
        <p className="mt-5 text-l md:text-l text-center text-[#80838A]">
           Have specific market questions, data insights or looking for a custom international data solution? <br/>Our expert team is ready to assist you with any questions you may have.
        </p>
      </div>
      <div
  className="absolute lg:flex hidden top-40 -left-40 w-[500px] h-[500px] rounded-full z-0 pointer-events-none blur-xl opacity-40"
  style={{
    background: "radial-gradient(circle at center, rgba(10, 21, 50, 0.5) 0%, rgba(10, 21, 50, 0.2) 60%, rgba(255, 255, 255, 0) 100%)",
  }}
></div>

<div
  className="absolute lg:flex hidden top-40 -right-40 w-[500px] h-[500px] rounded-full z-0 pointer-events-none blur-xl opacity-40"
  style={{
    background: "radial-gradient(circle at center, rgba(59, 161, 223, 0.5) 0%, rgba(59, 161, 223, 0.2) 60%, rgba(255, 255, 255, 0) 100%)",
  }}
></div>

      
{/* contact form */}
   <ContactForm/>

    </div>

            <Footer/>
   </section>
  );
};

export default Contact;

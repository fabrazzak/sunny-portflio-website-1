
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa6";
export default function ClientReviews() {
  return (
    <section className="w-full bg-[#c4c4c4] pt-20 pb-10 px-8 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 "
        style={{
           backgroundImage: 'url(/testimonials-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-md tracking-widest text-gray-700 mb-2">CLIENT</p>
          <h2 className="text-6xl font-bold tracking-tight">REVIEWS</h2>
        </div>

        {/* Review 1 */}
        <div className="mb-6">
          <div className="flex items-start gap-6 ">
            <div className="text-5xl font-serif leading-none"><FaQuoteLeft /></div>
            <p className="text-base leading-relaxed text-gray-800 pt-2">
             We purchased our 1st home with the assistance of these amazing professionals. MetroVan Realty was always responsive and patient, even at weekends and late evenings. No matter how many questions we’ve asked! He instructed us in the negotiation phase and saved our tens of thousands of dollars. I am so happy I followed everything he said. Excellent service and professionalism by MetroVan Realty. He was sincere and helpful from beginning to end. Just the type of person you need when looking for your first home. He gave us an honest view, which helped us taking informative decision. Would definitely recommend
            </p>
           
          </div>
           <p className="text-right mt-5 text-xl font-bold tracking-wider text-[#4a4a4a]">
            JAMES WRIGHT
          </p>
         
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-600 my-12"></div>

        {/* Review 2 - This is actually the main review from your image */}
        <div className="mb-12">
          <div className="flex items-start gap-6 mb-4">
            <p className="text-base leading-relaxed text-gray-800 pt-2">
              We purchased a property with the help of MetroVan Realty, and we couldn&apos;t be happier with their service. I remember not even wanting to go inside some homes, and he was more than happy to move on to the next. He was patient, understanding, and not pushy. We will definitely use MetroVan Realty for any future purchase...Thanks, MetroVan Realty.
            </p>
            <div className="text-5xl font-serif leading-none"><FaQuoteLeft /></div>
          </div>
          <p className="text-left text-xl font-bold tracking-wider text-[#4a4a4a]">
            Hon. Bruce McCallum
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-600 my-6"></div>

        {/* Read More Link */}
        <div className="text-center mt-8">
          <a
            href="/testimonials/"
            className="text-xs tracking-[0.2em] font-semibold text-gray-700 hover:underline transition-all duration-300 inline-block"
          >
            READ MORE TESTIMONIALS
          </a>
        </div>
      </div>
    </section>
  );
}
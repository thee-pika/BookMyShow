import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

const ImageSlider = () => {
  const images = [
    "/assets/mufasa-banner.avif",
    "/assets/random-banner.avif",
    "/assets/tamil.avif",
  ];

  return (
    <>
      <div className="image-slider bg-[#EEEFF1] p-4">
        <Swiper
          slidesPerView={2.5}
          spaceBetween={20}
          centeredSlides={false}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 1, spaceBetween: 30 },
            1024: { slidesPerView: 2.5, spaceBetween: 40 },
          }}

          className="w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="slider-slide">
              <div className="relative aspect-[21/9] w-full  overflow-hidden rounded-lg mt-4">
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}

export default ImageSlider

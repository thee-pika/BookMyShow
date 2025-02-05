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
      <div className="image-slider bg-[#EEEFF1]">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={-40}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className="w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="slider-slide">
              <div className="relative aspect-[21/9] w-full h-[300px] overflow-hidden rounded-lg mt-4">
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index < 3}
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
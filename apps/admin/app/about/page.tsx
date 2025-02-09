
const AboutPage = () => {
    return (
        <section className="w-full bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* About Us Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Welcome to BookMyShow St. Ann&apos;s Edition
                    </h1>
                    <p className="text-lg text-gray-600">
                        Your one-stop platform for booking and enjoying movie screenings every Saturday right on campus! 🎬✨
                    </p>
                    <p className="text-lg text-gray-600 mt-4">
                        At St. Ann&apos;s, we believe in creating opportunities for students to unwind, socialize, and enjoy quality entertainment without leaving the college premises. Our platform is designed to make your movie-going experience as seamless and enjoyable as possible.
                    </p>
                </div>

                {/* What We Offer Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">What We Offer</h2>
                    <ul className="space-y-4 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Weekly Movie Screenings: Catch the latest blockbusters, timeless classics, and student-favorite films every Saturday.
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Easy Seat Booking: Choose your preferred seats through our user-friendly interface and book them instantly.
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Hassle-Free Payments: Secure and reliable payment options ensure a smooth transaction process.
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Priority Queue System: Early birds get the best seats! Our system ranks users based on booking order for fair seat allocation.
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Real-Time Notifications: Stay updated with movie schedules, special screenings, and more.
                        </li>
                    </ul>
                </div>

                {/* How It Works Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">How It Works</h2>
                    <ol className="space-y-4 list-decimal list-inside text-gray-700">
                        <li>Sign Up or Log In: Create an account to access the booking platform.</li>
                        <li>Browse Movies: Explore the lineup of movies scheduled for the upcoming Saturdays.</li>
                        <li>Select Your Seats: Choose your seat type (e.g., General or Premium) and finalize your booking.</li>
                        <li>Make Payment: Complete the payment securely within a few minutes to confirm your booking.</li>
                        <li>Enjoy the Show: Arrive at the screening hall and enjoy the movie with your friends!</li>
                    </ol>
                </div>

                {/* Why Choose Us Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Why Choose Us?</h2>
                    <ul className="space-y-4 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Convenience: Book your seats anytime, anywhere.
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Transparency: Know exactly what you&apos;re paying for with clear pricing and seat availability.
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Secure Payments: Payments are processed through trusted gateways with refund guarantees for unsuccessful bookings.
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 font-bold mr-2">•</span>
                            Community Building: Movie nights foster a sense of togetherness and provide a fun way to de-stress after a long week.
                        </li>
                    </ul>
                </div>

                {/* Our Vision Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
                    <p className="text-lg text-gray-600">
                        We aim to enhance campus life by providing a reliable and enjoyable movie booking experience. With BookMyShow St. Ann&apos;s, our goal is to bring the magic of cinema to our students, making every Saturday a memorable one.
                    </p>
                </div>
            </div>
        </section>
    );
};


export default AboutPage
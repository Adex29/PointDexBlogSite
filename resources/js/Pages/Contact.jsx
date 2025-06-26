import React, { useState } from 'react';
import UserNavbar from "@/Components/UserNavbar";
import UserFooter from "@/Components/UserFooter";

const ContactUs = () => {
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Show the success popup
        setIsSuccessPopupVisible(true);

        // Optionally clear form fields (you can add state for form fields if needed)
        document.getElementById('contactForm').reset();
    };

    const handleClosePopup = () => {
        setIsSuccessPopupVisible(false);
    };

    return (
        <div>
            <UserNavbar />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Contact Us</h1>

                    {/* Centered Contact Form */}
                    <div className="flex justify-center">
                        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
                            <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>

                            {/* Contact Form */}
                            <form id="contactForm" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
                                    <input type="text" id="name" name="name" className="input input-bordered w-full mt-1" placeholder="Your Name" required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
                                    <input type="email" id="email" name="email" className="input input-bordered w-full mt-1" placeholder="Your Email" required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Message</label>
                                    <textarea id="message" name="message" className="textarea textarea-bordered w-full mt-1" rows="5" placeholder="Your Message" required></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-full mt-3">Send Message</button>
                            </form>

                            {/* Success Pop-up */}
                            {isSuccessPopupVisible && (
                                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                        <h2 className="text-2xl font-bold text-green-600 mb-4">Message Sent!</h2>
                                        <p className="text-gray-700">Thank you for getting in touch. We will get back to you shortly.</p>
                                        <button
                                            onClick={handleClosePopup}
                                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            OK
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <UserFooter />
        </div>

    );
};

export default ContactUs;

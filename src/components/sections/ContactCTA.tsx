'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, Calendar, MapPin, Star, ArrowRight, Award, Coffee } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ContactCTA() {
  const router = useRouter();
  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: '+94 77 621 6556',
      action: 'Call Now',
      href: 'tel:+94776216556',
      color: 'text-primary-500',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Instant messaging',
      action: 'WhatsApp Chat',
      href: 'https://wa.me/94776216556',
      color: 'text-green-500',
    },
    {
      icon: Calendar,
      title: 'Book Consultation',
      description: 'Free 30-min call',
      action: 'Schedule Now',
      href: '/contact',
      color: 'text-blue-500',
    },
    {
      icon: MapPin,
      title: 'Visit Studio',
      description: 'Jaffna, Sri Lanka',
      action: 'Get Directions',
      href: 'https://maps.google.com/?q=Jaffna,Sri+Lanka',
      color: 'text-purple-500',
    },
  ];



  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-cosmic-gradient relative overflow-hidden transition-colors duration-300">
      {/* Light Mode Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-white opacity-100 dark:opacity-0 pointer-events-none transition-opacity duration-300"></div>

      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-star-field opacity-0 dark:opacity-10 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-nebula opacity-0 dark:opacity-5 transition-opacity duration-300"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            Ready to Create <span className="text-primary-600 dark:text-cosmic">Magic</span> Together?
          </h2>
          <p className="text-xl text-gray-700 dark:text-white/80 max-w-3xl mx-auto transition-colors duration-300">
            Let’s discuss your vision and create something extraordinary. 
            Every love story deserves to be told beautifully.
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-white dark:bg-space-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 dark:border-white/10 hover:border-primary-500/50 dark:hover:border-primary-500/50 shadow-sm dark:shadow-none transition-all duration-300 premium-hover dark:cosmic-glow">
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gray-50 dark:bg-space-800/50 flex items-center justify-center group-hover:bg-primary-50/80 dark:group-hover:bg-primary-500/20 transition-colors duration-300`}>
                    <method.icon className={`w-8 h-8 ${method.color} group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors duration-300`} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                      {method.title}
                    </h3>
                    <p className="text-gray-500 dark:text-white/70 text-sm mb-4 transition-colors duration-300">
                      {method.description}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-700 dark:text-white group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-500/20 dark:group-hover:text-primary-500 transition-all duration-300"
                    onClick={() => {
                      if (method.href.startsWith('/')) {
                        router.push(method.href);
                        return;
                      }

                      if (method.href.startsWith('tel:') || method.href.startsWith('mailto:')) {
                        window.location.href = method.href;
                        return;
                      }

                      window.open(method.href, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    {method.action}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>



        {/* CTA Section */}
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Let’s Start Your Journey
            </h3>
            <p className="text-gray-700 dark:text-white/80 text-lg max-w-2xl mx-auto transition-colors duration-300">
              Every great love story begins with a single moment. 
              Let’s capture yours together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              variant="primary"
              size="lg"
              className="cosmic-glow group"
              onClick={() => {
                window.location.href = 'tel:+94776216556';
              }}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now: +94 77 621 6556
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/50 dark:bg-transparent dark:glass-effect hover:bg-white text-gray-900 dark:text-white border-gray-200 dark:border-primary-500 group transition-all"
              onClick={() => {
                window.open('https://wa.me/94776216556', '_blank', 'noopener,noreferrer');
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-500" />
              WhatsApp Chat
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-700 dark:text-white/80 font-medium transition-colors duration-300 pt-4">
            <div className="flex items-center space-x-3 bg-white dark:bg-white/5 px-5 py-2.5 rounded-full border border-gray-100 dark:border-white/10 shadow-sm premium-hover">
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-primary-500 fill-primary-500 drop-shadow-sm" />
                ))}
              </div>
              <span className="font-semibold">5.0 Rating</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-white/5 px-5 py-2.5 rounded-full border border-gray-100 dark:border-white/10 shadow-sm premium-hover">
              <Award className="w-5 h-5 text-primary-500 drop-shadow-sm" />
              <span>Premium Service</span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-white/5 px-5 py-2.5 rounded-full border border-gray-100 dark:border-white/10 shadow-sm premium-hover">
              <Coffee className="w-5 h-5 text-primary-500 drop-shadow-sm" />
              <span>Free Consultation</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary-500 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary-500 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-float opacity-30" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </section>
  );
}
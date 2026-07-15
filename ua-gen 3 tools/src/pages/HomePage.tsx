import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Image as ImageIcon, ShieldCheck, Zap, ServerOff, ArrowRight, Shield, Globe, Bot, Terminal, Activity } from 'lucide-react';
import HomeFooter from '../components/HomeFooter';
import { motion } from 'motion/react';

export default function HomePage() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <div className="flex flex-col flex-grow pt-8 pb-16 space-y-24 w-full overflow-hidden">
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center px-4 md:px-8 max-w-4xl mx-auto space-y-8 relative z-10 mt-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
          Powerful Web Tools, <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">All in One Place</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#c2c6d6]/80 max-w-2xl leading-relaxed">
          Streamline your workflow with our highly optimized client-side utilities. Generate realistic User Agents in bulk or resize and convert your photos securely—all within your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button
            onClick={() => navigate('/login', { state: { initialTab: 'register' } })}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] text-white font-bold text-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:-translate-y-1 transition-all active:scale-95 group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={scrollToFeatures}
            className="px-8 py-3.5 rounded-2xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 hover:border-white/20 transition-all active:scale-95"
          >
            Learn More
          </button>
        </div>
      </motion.section>

      {/* Trust / Why Us Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="px-4 md:px-8 max-w-5xl mx-auto w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg">100% Client-Side</h3>
            <p className="text-[#c2c6d6]/60 text-sm">All tools execute securely directly in your browser. Complete privacy.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] mb-2">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg">Fast & Free</h3>
            <p className="text-[#c2c6d6]/60 text-sm">No waiting times or limits. Highly optimized performance for seamless use.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] mb-2">
              <ServerOff className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg">No Server Storage</h3>
            <p className="text-[#c2c6d6]/60 text-sm">Your files and generated data are never uploaded to our servers.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="px-4 max-w-7xl mx-auto w-full space-y-12 scroll-mt-24"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose UA GEN?</h2>
          <p className="text-[#c2c6d6]/70">Professional grade utilities designed for developers and creators.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="group relative bg-[#0b1326]/50 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-[#a78bfa]/50 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] flex flex-col h-full z-10 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#a78bfa]/10 blur-[50px] -z-10 group-hover:bg-[#a78bfa]/20 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#a78bfa]/10 rounded-xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa]/20 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
              <Zap className="w-6 h-6 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide mb-3">Lightning Fast</h3>
            <p className="text-sm text-[#c2c6d6]/70 leading-relaxed">
              Experience instantaneous processing with sub-200ms response times across all our tools.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="group relative bg-[#0b1326]/50 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-[#a78bfa]/50 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] flex flex-col h-full z-10 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#a78bfa]/10 blur-[50px] -z-10 group-hover:bg-[#a78bfa]/20 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#a78bfa]/10 rounded-xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa]/20 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
              <Shield className="w-6 h-6 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide mb-3">Privacy First</h3>
            <p className="text-sm text-[#c2c6d6]/70 leading-relaxed">
              Your privacy is our priority. No data is stored, logged, or tracked — it's all processed locally.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="group relative bg-[#0b1326]/50 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-[#a78bfa]/50 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] flex flex-col h-full z-10 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#a78bfa]/10 blur-[50px] -z-10 group-hover:bg-[#a78bfa]/20 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#a78bfa]/10 rounded-xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa]/20 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
              <Globe className="w-6 h-6 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide mb-3">150+ Countries</h3>
            <p className="text-sm text-[#c2c6d6]/70 leading-relaxed">
              Full coverage for over 150 countries in name, phone, address and identity generation.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants} className="group relative bg-[#0b1326]/50 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-[#a78bfa]/50 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] flex flex-col h-full z-10 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#a78bfa]/10 blur-[50px] -z-10 group-hover:bg-[#a78bfa]/20 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#a78bfa]/10 rounded-xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa]/20 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
              <Bot className="w-6 h-6 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide mb-3">AI Powered</h3>
            <p className="text-sm text-[#c2c6d6]/70 leading-relaxed">
              Harness the power of AI to generate realistic data, identities, and content effortlessly.
            </p>
          </motion.div>

          {/* Card 5 */}
          <motion.div variants={itemVariants} className="group relative bg-[#0b1326]/50 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-[#a78bfa]/50 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] flex flex-col h-full z-10 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#a78bfa]/10 blur-[50px] -z-10 group-hover:bg-[#a78bfa]/20 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#a78bfa]/10 rounded-xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa]/20 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
              <Terminal className="w-6 h-6 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide mb-3">Developer API</h3>
            <p className="text-sm text-[#c2c6d6]/70 leading-relaxed">
              Empower your projects with our robust REST API, designed for seamless integration and scalability.
            </p>
          </motion.div>

          {/* Card 6 */}
          <motion.div variants={itemVariants} className="group relative bg-[#0b1326]/50 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-[#a78bfa]/50 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] flex flex-col h-full z-10 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#a78bfa]/10 blur-[50px] -z-10 group-hover:bg-[#a78bfa]/20 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#a78bfa]/10 rounded-xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa]/20 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
              <ShieldCheck className="w-6 h-6 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide mb-3">High Compatibility</h3>
            <p className="text-sm text-[#c2c6d6]/70 leading-relaxed">
              Fully optimized for Chrome, Firefox, Safari, and Edge. Works seamlessly across all major browsers.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Tools Section */}
      <motion.section 
        id="tools-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="px-4 max-w-5xl mx-auto w-full space-y-12 scroll-mt-24"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Our Tools</h2>
          <p className="text-[#c2c6d6]/70">Professional grade utilities designed for developers and creators.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* UA Gen Card */}
          <motion.div 
            onClick={() => navigate('/login', { state: { initialTab: 'register' } })}
            variants={itemVariants} 
            className="group relative bg-[#0b1326] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-[#22d3ee]/50 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col h-full z-10 overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee]/10 blur-[50px] -z-10 group-hover:bg-[#22d3ee]/20 transition-all duration-500"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#22d3ee]/10 rounded-xl text-[#22d3ee] border border-[#22d3ee]/20 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                <Settings className="w-8 h-8 transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">UA Generator</h3>
                <span className="text-xs text-[#22d3ee] font-mono uppercase tracking-wider">Advanced Utility</span>
              </div>
            </div>
            <p className="text-sm text-[#c2c6d6]/80 leading-relaxed mb-6">
              Generate bulk, realistic, randomized User Agent strings across browsers, devices, and OS with advanced customization.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" /> Bulk generation capability
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" /> Realistic randomized strings
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" /> Multi-browser/OS support
              </li>
            </ul>
          </motion.div>

          {/* Photo Resize Card */}
          <motion.div 
            onClick={() => navigate('/login', { state: { initialTab: 'register' } })}
            variants={itemVariants} 
            className="group relative bg-[#0b1326] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-[#a78bfa]/50 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] flex flex-col h-full z-10 overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#a78bfa]/10 blur-[50px] -z-10 group-hover:bg-[#a78bfa]/20 transition-all duration-500"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#a78bfa]/10 rounded-xl text-[#a78bfa] border border-[#a78bfa]/20 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                <ImageIcon className="w-8 h-8 transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">Photo Resize & Convert</h3>
                <span className="text-xs text-[#a78bfa] font-mono uppercase tracking-wider">Media Utility</span>
              </div>
            </div>
            <p className="text-sm text-[#c2c6d6]/80 leading-relaxed mb-6">
              Quickly resize, convert, and compress JPG, PNG, WebP, GIF, or HEIC files locally in your browser. Fast & secure.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" /> Smart cropping & resizing
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" /> Multiple format conversion
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" /> High quality compression
              </li>
            </ul>
          </motion.div>
        </div>


      </motion.section>

      {/* Final CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center space-y-6"
      >
        <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
        <button
          onClick={() => navigate('/login', { state: { initialTab: 'register' } })}
          className="px-8 py-4 rounded-2xl bg-[#22d3ee] text-[#0b1326] font-extrabold text-lg hover:bg-[#4cd7f6] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:-translate-y-1 active:scale-95 inline-flex items-center gap-2"
        >
          Create Free Account
        </button>
      </motion.section>
    </div>
    <HomeFooter />
  </>
);
}


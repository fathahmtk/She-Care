import React from 'react';
import '../types';
import type { BlogPost } from '../types';
import ArrowRightIcon from './icons/ArrowRightIcon';

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    category: 'Wellness',
    title: 'The Modern Woman\'s Guide to Mindful Mornings',
    snippet: 'Discover simple rituals to start your day with intention and calm, setting a positive tone for whatever lies ahead.',
    imageUrl: 'https://images.pexels.com/photos/3771045/pexels-photo-3771045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    href: '#',
  },
  {
    id: 2,
    category: 'Skincare',
    title: 'Unlocking Radiance: The Power of Natural Ingredients',
    snippet: 'We dive deep into the potent benefits of botanical extracts and how they can transform your skincare routine.',
    imageUrl: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    href: '#',
  },
  {
    id: 3,
    category: 'Self-Care',
    title: 'Creating Your At-Home Spa Sanctuary',
    snippet: 'Turn your bathroom into a blissful retreat. We share our secrets for an indulgent, rejuvenating spa experience at home.',
    imageUrl: 'https://images.pexels.com/photos/7262899/pexels-photo-7262899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    href: '#',
  },
];


const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">From Our Journal</h2>
        <p className="text-text-secondary mb-12 max-w-3xl mx-auto">
          Insights, tips, and stories on wellness and self-care, crafted just for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map(post => (
            <div key={post.id} className="bg-surface rounded-lg shadow-sm overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <a href={post.href} className="block">
                <div className="relative overflow-hidden">
                  <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </a>
              <div className="p-6 text-left flex flex-col flex-grow">
                <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-2">{post.category}</p>
                <a href={post.href} className="block">
                    <h3 className="font-heading text-xl font-semibold text-text-primary hover:text-accent transition-colors mb-3">
                        {post.title}
                    </h3>
                </a>
                <p className="text-text-secondary text-sm font-body leading-relaxed flex-grow">{post.snippet}</p>
                <div className="mt-4 pt-4 border-t border-border-color">
                  <a href={post.href} className="text-accent font-semibold inline-flex items-center gap-2 group/link">
                    <span>Read More</span>
                    <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
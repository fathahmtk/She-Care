import React from 'react';
// FIX: Removed redundant side-effect import for 'types.ts'.
import type { BlogPost } from '../types';
import ArrowRightIcon from './icons/ArrowRightIcon';

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    category: 'Style Guide',
    title: '5 Modern Ways to Style a Traditional Kasavu Saree',
    snippet: 'From pairing it with a crop top to draping it in new ways, discover how to give the timeless Kasavu saree a contemporary twist.',
    imageUrl: 'https://images.pexels.com/photos/18029683/pexels-photo-18029683/free-photo-of-woman-in-traditional-indian-sari.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    href: '#',
  },
  {
    id: 2,
    category: 'Jewelry',
    title: 'A Guide to Kerala\'s Temple Jewelry',
    snippet: 'Explore the history and significance of iconic pieces like the Palakka Mala and Kasumala, and learn how to choose them.',
    imageUrl: 'https://images.pexels.com/photos/15993936/pexels-photo-15993936/free-photo-of-a-woman-wearing-a-traditional-indian-wedding-dress.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    href: '#',
  },
  {
    id: 3,
    category: 'Inspiration',
    title: 'The Magic of Kerala Handloom',
    snippet: 'A look into the rich tradition of handloom weaving in Kerala, celebrating the artisans who create our beautiful cotton sarees.',
    imageUrl: 'https://images.pexels.com/photos/8999990/pexels-photo-8999990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    href: '#',
  },
];


const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">From Our Journal</h2>
        <p className="text-text-secondary mb-12 max-w-3xl mx-auto">
          Inspiration, trends, and conversations on the art of modern Kerala style.
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

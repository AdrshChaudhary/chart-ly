
"use client";

import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram, Book, Globe } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/AdrshChaudhary',
    icon: Github,
  },
  {
    name: 'Twitter',
    url: 'https://x.com/ImAadrsh',
    icon: Twitter,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/aadarshchaudhary/',
    icon: Linkedin,
  },
    {
    name: 'Instagram',
    url: 'https://www.instagram.com/aadar.ssshhh/',
    icon: Instagram,
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@im.aadrsh',
    icon: Book,
  },
  {
    name: 'Portfolio',
    url: 'https://aadrsh.netlify.app/',
    icon: Globe,
  },
];

export default function Footer() {
  return (
    <footer className="w-full shrink-0 border-t bg-background">
        <div className="container flex flex-col items-center justify-center gap-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
                Made by Aadarsh Chaudhary
            </p>
            <div className="flex items-center gap-4">
                {socialLinks.map((link) => (
                    <Link
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.name}</span>
                    </Link>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Chartly. All rights reserved.</p>
        </div>
    </footer>
  );
}

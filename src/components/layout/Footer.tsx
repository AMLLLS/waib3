import Link from 'next/link'
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa'
import { type ReactNode } from 'react'

interface FooterLinkProps {
  href: string;
  children: ReactNode;
}

interface SocialLinkProps {
  href: string;
  icon: ReactNode;
}

const Footer = () => {
  return (
    <footer className="bg-dark-light py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold">
              Design<span className="text-primary">Master</span>
            </h3>
            <p className="text-gray-400">
              Transformez votre vision du design digital à travers une expérience d'apprentissage unique.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Plateforme</h4>
            <ul className="space-y-2">
              <FooterLink href="/formations">Formations</FooterLink>
              <FooterLink href="/ressources">Ressources</FooterLink>
              <FooterLink href="/pricing">Tarifs</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Ressources</h4>
            <ul className="space-y-2">
              <FooterLink href="/documentation">Documentation</FooterLink>
              <FooterLink href="/tutoriels">Tutoriels</FooterLink>
              <FooterLink href="/templates">Templates</FooterLink>
              <FooterLink href="/showcase">Showcase</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Communauté</h4>
            <div className="flex space-x-4">
              <SocialLink href="https://twitter.com" icon={<FaTwitter size={24} />} />
              <SocialLink href="https://github.com" icon={<FaGithub size={24} />} />
              <SocialLink href="https://discord.com" icon={<FaDiscord size={24} />} />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} DesignMaster. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <li>
    <Link 
      href={href}
      className="text-gray-400 hover:text-white transition-colors"
    >
      {children}
    </Link>
  </li>
)

const SocialLink = ({ href, icon }: SocialLinkProps) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-primary transition-colors"
  >
    {icon}
  </a>
)

export default Footer 
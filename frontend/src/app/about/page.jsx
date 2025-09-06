import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl mb-6">
          About <span className="text-primary">EcoFinds</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
          Connecting eco-conscious consumers with sustainable products since 2023.
        </p>
      </div>

      {/* Our Mission */}
      <div className="mb-20">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              At EcoFinds, we believe that sustainable shopping shouldn't be a challenge. 
              Our mission is to create a marketplace where environmentally conscious 
              consumers can easily discover and purchase products that align with their values.
            </p>
            <p className="text-lg text-muted-foreground">
              We carefully vet all sellers and products on our platform to ensure they meet 
              our strict sustainability standards. By connecting consumers directly with 
              eco-friendly sellers, we're building a community dedicated to reducing 
              environmental impact and promoting sustainable living.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <Image 
                src="/about.svg" 
                alt="EcoFinds mission" 
                fill 
               
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">Sustainability</h3>
                <p className="text-muted-foreground">
                  We prioritize products that minimize environmental impact through sustainable materials, 
                  production methods, and packaging.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We foster connections between eco-conscious consumers and ethical sellers, 
                  creating a community dedicated to sustainable living.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in full disclosure about product origins, materials, and environmental impact, 
                  empowering consumers to make informed choices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
              <Image 
                src="/placeholder-eco.jpg" 
                alt="Team member" 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>
            <h3 className="text-xl font-medium text-foreground">Alex Green</h3>
            <p className="text-primary mb-2">Founder & CEO</p>
            <p className="text-muted-foreground">
              Passionate about sustainable business models and circular economy solutions.
            </p>
          </div>

          {/* Team Member 2 */}
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
              <Image 
                src="/placeholder-eco.jpg" 
                alt="Team member" 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>
            <h3 className="text-xl font-medium text-foreground">Sam Rivers</h3>
            <p className="text-primary mb-2">CTO</p>
            <p className="text-muted-foreground">
              Tech innovator focused on creating sustainable digital solutions.
            </p>
          </div>

          {/* Team Member 3 */}
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
              <Image 
                src="/placeholder-eco.jpg" 
                alt="Team member" 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>
            <h3 className="text-xl font-medium text-foreground">Jamie Taylor</h3>
            <p className="text-primary mb-2">Head of Sustainability</p>
            <p className="text-muted-foreground">
              Environmental scientist ensuring all products meet our eco-standards.
            </p>
          </div>
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="bg-secondary rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Mission</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
          Whether you're a consumer looking for sustainable products or a seller with eco-friendly offerings, 
          we invite you to join our growing community and be part of the solution.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg">
            Browse Products
          </Button>
          <Button variant="outline" size="lg">
            Become a Seller
          </Button>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Home,
  Mail,
  Lock,
  User,
  Phone,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function ComponentsShowcase() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            Component Showcase
          </h1>
          <p className="text-xl text-neutral-600 mb-6">
            Explore all UI components used in the Van Pooling Management System
          </p>
          <Link to="/">
            <Button variant="outline">
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button styles and sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="accent">Accent Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">
                    <Mail className="w-5 h-5" />
                    Send Email
                  </Button>
                  <Button variant="secondary">
                    <Phone className="w-5 h-5" />
                    Call Now
                  </Button>
                  <Button variant="accent">
                    <AlertTriangle className="w-5 h-5" />
                    Report Issue
                  </Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button isLoading>Loading...</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status indicators and labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="success">
                <CheckCircle className="w-3 h-3" />
                Completed
              </Badge>
              <Badge variant="warning">
                <AlertTriangle className="w-3 h-3" />
                Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Input Fields</CardTitle>
            <CardDescription>Form input components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="your.email@example.com"
                icon={<Mail className="w-5 h-5" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                icon={<Lock className="w-5 h-5" />}
              />
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={<User className="w-5 h-5" />}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                icon={<Phone className="w-5 h-5" />}
              />
              <Input
                label="With Error"
                type="text"
                placeholder="Invalid input"
                error="This field is required"
              />
            </div>
          </CardContent>
        </Card>

        {/* Avatars */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
            <CardDescription>User profile images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Sizes</h3>
                <div className="flex items-center gap-4">
                  <Avatar name="John Smith" size="sm" />
                  <Avatar name="Sarah Johnson" size="md" />
                  <Avatar name="Michael Brown" size="lg" />
                  <Avatar name="Emily Davis" size="xl" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">With Names</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar name="John Smith" size="md" />
                    <span className="text-sm font-medium">John Smith</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar name="Sarah Johnson" size="md" />
                    <span className="text-sm font-medium">Sarah Johnson</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar name="Michael Brown" size="md" />
                    <span className="text-sm font-medium">Michael Brown</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
              <CardDescription>Simple card with header and content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                This is a basic card component with a header and content area.
              </p>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <CardTitle>Hoverable Card</CardTitle>
              <CardDescription>Card with hover effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700">
                Hover over this card to see the elevation effect.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-secondary text-white">
            <CardHeader>
              <CardTitle className="text-white">Gradient Card</CardTitle>
              <CardDescription className="text-white/80">
                Card with gradient background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                This card has a beautiful gradient background.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Indicators */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
            <CardDescription>Visual status dots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="status-dot status-active" />
                <span className="text-sm text-neutral-700">Active / Online</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="status-dot status-inactive" />
                <span className="text-sm text-neutral-700">Inactive / Offline</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="status-dot status-warning" />
                <span className="text-sm text-neutral-700">Warning / Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="status-dot status-danger" />
                <span className="text-sm text-neutral-700">Danger / Error</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Design system colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="w-full h-20 bg-primary rounded-lg mb-2" />
                <p className="text-sm font-medium text-neutral-900">Primary</p>
                <p className="text-xs text-neutral-600">#1A2A6C</p>
              </div>
              <div>
                <div className="w-full h-20 bg-secondary rounded-lg mb-2" />
                <p className="text-sm font-medium text-neutral-900">Secondary</p>
                <p className="text-xs text-neutral-600">#00B8D4</p>
              </div>
              <div>
                <div className="w-full h-20 bg-accent rounded-lg mb-2" />
                <p className="text-sm font-medium text-neutral-900">Accent</p>
                <p className="text-xs text-neutral-600">#FF6F61</p>
              </div>
              <div>
                <div className="w-full h-20 bg-highlight rounded-lg mb-2" />
                <p className="text-sm font-medium text-neutral-900">Highlight</p>
                <p className="text-xs text-neutral-600">#FFD460</p>
              </div>
              <div>
                <div className="w-full h-20 bg-neutral-200 rounded-lg mb-2" />
                <p className="text-sm font-medium text-neutral-900">Neutral</p>
                <p className="text-xs text-neutral-600">#F4F4F4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Text styles and hierarchy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-neutral-900">Heading 1</h1>
              <h2 className="text-4xl font-bold text-neutral-900">Heading 2</h2>
              <h3 className="text-3xl font-semibold text-neutral-900">Heading 3</h3>
              <h4 className="text-2xl font-semibold text-neutral-900">Heading 4</h4>
              <h5 className="text-xl font-medium text-neutral-900">Heading 5</h5>
              <h6 className="text-lg font-medium text-neutral-900">Heading 6</h6>
              <p className="text-base text-neutral-700">
                Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-sm text-neutral-600">
                Small text - Sed do eiusmod tempor incididunt ut labore.
              </p>
              <p className="text-xs text-neutral-500">
                Extra small text - Et dolore magna aliqua.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-secondary-50 border-l-4 border-secondary">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Component Library</h3>
                <p className="text-sm text-neutral-700">
                  All these components are reusable and can be found in the <code className="px-2 py-1 bg-white rounded text-xs">/components/ui/</code> directory.
                  They follow consistent design patterns and are fully typed with TypeScript.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import SimpleDragDemo from '../../components/editor/SimpleDragDemo';

export default function SimpleDragPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Simple Drag and Drop Demo</h1>
      <SimpleDragDemo />
    </div>
  );
}

// src/app/simple-resume/page.jsx
'use client';

import { DraggableResumePage } from '../../components/templates/DraggableResumeTemplate';

export default function SimpleResumePage() {
  return (
    <div className="resume-font">
      <DraggableResumePage />
    </div>
  );
}
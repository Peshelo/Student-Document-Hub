"use client"
import * as React from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


export default function ViewPdf({pdfUrl}) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (

<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
<div
    style={{
        border: '1px solid rgba(0, 0, 0, 0.3)',
        width: '1000px',
        height: '650px',
    }}
>
<Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />;
</div>

</Worker>

  );
}
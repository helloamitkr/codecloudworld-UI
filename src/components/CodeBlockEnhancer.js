import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/CourseDetail.module.css';

export function CodeBlockEnhancer({ children, className = '' }) {
  const containerRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const codeBlocks = containerRef.current.querySelectorAll('pre code, pre');
    
    codeBlocks.forEach((element, index) => {
      let preElement, codeElement;
      
      if (element.tagName === 'PRE') {
        preElement = element;
        codeElement = element.querySelector('code') || element;
      } else {
        codeElement = element;
        preElement = element.parentElement;
      }
      
      // Skip if not a pre element or already enhanced
      if (!preElement || preElement.tagName !== 'PRE' || preElement.querySelector('.copy-button')) return;
      
      // Ensure pre element has relative positioning
      preElement.style.position = 'relative';
      
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = `${styles.copyBtn} copy-button`;
      copyButton.style.position = 'absolute';
      copyButton.style.top = '0.5rem';
      copyButton.style.right = '0.5rem';
      copyButton.style.zIndex = '10';
      copyButton.setAttribute('aria-label', 'Copy code to clipboard');
      
      const updateButton = (isCopied) => {
        copyButton.innerHTML = isCopied 
          ? '<span class="copy-icon">✓</span> Copied!'
          : '<span class="copy-icon">📋</span> Copy';
        copyButton.className = `${styles.copyBtn} copy-button ${isCopied ? styles.copied : ''}`;
      };
      
      updateButton(false);
      
      copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const codeText = codeElement.textContent || preElement.textContent || '';
        copyToClipboard(codeText.trim(), index);
      });
      
      // Add the button to the pre element
      preElement.appendChild(copyButton);
      
      // Store the update function for later use
      preElement._updateCopyButton = () => updateButton(copiedIndex === index);
      preElement._copyIndex = index;
    });
  }, [copiedIndex]);

  // Update all buttons when copiedIndex changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const preElements = containerRef.current.querySelectorAll('pre');
    preElements.forEach((pre) => {
      if (pre._updateCopyButton) {
        pre._updateCopyButton();
      }
    });
  }, [copiedIndex]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

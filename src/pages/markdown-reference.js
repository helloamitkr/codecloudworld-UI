import Head from 'next/head';
import styles from '../styles/MarkdownReference.module.css';

export default function MarkdownReference() {
  return (
    <>
      <Head>
        <title>Markdown Syntax Reference - Complete Guide</title>
        <meta name="description" content="Complete markdown syntax reference and cheat sheet for course content creation" />
      </Head>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>📝 Markdown Syntax Reference</h1>
          <p>Complete guide and cheat sheet for writing markdown content</p>
        </header>

        <nav className={styles.tableOfContents}>
          <h2>📚 Table of Contents</h2>
          <ul>
            <li><a href="#headings">Headings</a></li>
            <li><a href="#text-formatting">Text Formatting</a></li>
            <li><a href="#lists">Lists</a></li>
            <li><a href="#links-images">Links & Images</a></li>
            <li><a href="#code">Code</a></li>
            <li><a href="#tables">Tables</a></li>
            <li><a href="#blockquotes">Blockquotes</a></li>
            <li><a href="#horizontal-rules">Horizontal Rules</a></li>
            <li><a href="#line-breaks">Line Breaks</a></li>
            <li><a href="#escape-characters">Escape Characters</a></li>
            <li><a href="#course-examples">Course Examples</a></li>
            <li><a href="#best-practices">Best Practices</a></li>
          </ul>
        </nav>

        <main className={styles.content}>
          
          {/* Headings */}
          <section id="headings" className={styles.section}>
            <h2>🏷️ Headings</h2>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h3>Markdown:</h3>
                <pre><code>{`# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`}</code></pre>
              </div>
              <div className={styles.result}>
                <h3>Result:</h3>
                <h1>Heading 1</h1>
                <h2>Heading 2</h2>
                <h3>Heading 3</h3>
                <h4>Heading 4</h4>
                <h5>Heading 5</h5>
                <h6>Heading 6</h6>
              </div>
            </div>
            <div className={styles.usage}>
              <strong>Usage:</strong> Use H1 for course titles, H2 for major sections, H3 for lessons, H4 for subsections.
            </div>
          </section>

          {/* Text Formatting */}
          <section id="text-formatting" className={styles.section}>
            <h2>✨ Text Formatting</h2>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h3>Markdown:</h3>
                <pre><code>{`**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
\`Inline code\`
Regular text`}</code></pre>
              </div>
              <div className={styles.result}>
                <h3>Result:</h3>
                <p><strong>Bold text</strong></p>
                <p><em>Italic text</em></p>
                <p><strong><em>Bold and italic</em></strong></p>
                <p><del>Strikethrough</del></p>
                <p><code>Inline code</code></p>
                <p>Regular text</p>
              </div>
            </div>
          </section>

          {/* Lists */}
          <section id="lists" className={styles.section}>
            <h2>📋 Lists</h2>
            
            <h3>Unordered Lists</h3>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h4>Markdown:</h4>
                <pre><code>{`- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3`}</code></pre>
              </div>
              <div className={styles.result}>
                <h4>Result:</h4>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2
                    <ul>
                      <li>Nested item</li>
                      <li>Another nested item</li>
                    </ul>
                  </li>
                  <li>Item 3</li>
                </ul>
              </div>
            </div>

            <h3>Ordered Lists</h3>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h4>Markdown:</h4>
                <pre><code>{`1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item`}</code></pre>
              </div>
              <div className={styles.result}>
                <h4>Result:</h4>
                <ol>
                  <li>First item</li>
                  <li>Second item
                    <ol>
                      <li>Nested numbered item</li>
                      <li>Another nested item</li>
                    </ol>
                  </li>
                  <li>Third item</li>
                </ol>
              </div>
            </div>

            <h3>Task Lists</h3>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h4>Markdown:</h4>
                <pre><code>{`- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task`}</code></pre>
              </div>
              <div className={styles.result}>
                <h4>Result:</h4>
                <ul className={styles.taskList}>
                  <li>✅ Completed task</li>
                  <li>☐ Incomplete task</li>
                  <li>☐ Another incomplete task</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Links & Images */}
          <section id="links-images" className={styles.section}>
            <h2>🔗 Links & Images</h2>
            
            <h3>Links</h3>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h4>Markdown:</h4>
                <pre><code>{`[Link text](https://example.com)
[Link with title](https://example.com "Hover title")
<https://example.com>
[Reference link][1]

[1]: https://example.com "Reference link"`}</code></pre>
              </div>
              <div className={styles.result}>
                <h4>Result:</h4>
                <p><a href="https://example.com">Link text</a></p>
                <p><a href="https://example.com" title="Hover title">Link with title</a></p>
                <p><a href="https://example.com">https://example.com</a></p>
                <p><a href="https://example.com">Reference link</a></p>
              </div>
            </div>

            <h3>Images</h3>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h4>Markdown:</h4>
                <pre><code>{`![Alt text](https://via.placeholder.com/150)
![Alt text](https://via.placeholder.com/150 "Image title")
[![Image link](https://via.placeholder.com/100)](https://example.com)`}</code></pre>
              </div>
              <div className={styles.result}>
                <h4>Result:</h4>
                <p><img src="https://via.placeholder.com/150" alt="Alt text" /></p>
                <p><img src="https://via.placeholder.com/150" alt="Alt text" title="Image title" /></p>
                <p><a href="https://example.com"><img src="https://via.placeholder.com/100" alt="Image link" /></a></p>
              </div>
            </div>
          </section>

          {/* Code */}
          <section id="code" className={styles.section}>
            <h2>💻 Code</h2>
            
            <h3>Inline Code</h3>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h4>Markdown:</h4>
                <pre><code>{`Use the \`console.log()\` function to print output.`}</code></pre>
              </div>
              <div className={styles.result}>
                <h4>Result:</h4>
                <p>Use the <code>console.log()</code> function to print output.</p>
              </div>
            </div>

            <h3>Code Blocks</h3>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h4>Markdown:</h4>
                <pre><code>{`\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
hello();
\`\`\``}</code></pre>
              </div>
              <div className={styles.result}>
                <h4>Result:</h4>
                <pre className={styles.codeBlock}><code>{`function hello() {
    console.log("Hello, World!");
}
hello();`}</code></pre>
              </div>
            </div>

            <h3>Common Languages</h3>
            <div className={styles.languageGrid}>
              <div><code>```javascript</code></div>
              <div><code>```python</code></div>
              <div><code>```go</code></div>
              <div><code>```java</code></div>
              <div><code>```html</code></div>
              <div><code>```css</code></div>
              <div><code>```bash</code></div>
              <div><code>```json</code></div>
            </div>
          </section>

          {/* Tables */}
          <section id="tables" className={styles.section}>
            <h2>📊 Tables</h2>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h3>Markdown:</h3>
                <pre><code>{`| Feature | Description | Example |
|---------|-------------|---------|
| Variables | Store data | \`let x = 5\` |
| Functions | Reusable code | \`function()\` |
| Arrays | List of items | \`[1, 2, 3]\` |`}</code></pre>
              </div>
              <div className={styles.result}>
                <h3>Result:</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Description</th>
                      <th>Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Variables</td>
                      <td>Store data</td>
                      <td><code>let x = 5</code></td>
                    </tr>
                    <tr>
                      <td>Functions</td>
                      <td>Reusable code</td>
                      <td><code>function()</code></td>
                    </tr>
                    <tr>
                      <td>Arrays</td>
                      <td>List of items</td>
                      <td><code>[1, 2, 3]</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Blockquotes */}
          <section id="blockquotes" className={styles.section}>
            <h2>💬 Blockquotes</h2>
            <div className={styles.example}>
              <div className={styles.markdown}>
                <h3>Markdown:</h3>
                <pre><code>{`> This is a blockquote.
> 
> It can span multiple lines.
> 
> > Nested blockquote`}</code></pre>
              </div>
              <div className={styles.result}>
                <h3>Result:</h3>
                <blockquote className={styles.blockquote}>
                  <p>This is a blockquote.</p>
                  <p>It can span multiple lines.</p>
                  <blockquote>
                    <p>Nested blockquote</p>
                  </blockquote>
                </blockquote>
              </div>
            </div>
          </section>

          {/* Course Examples */}
          <section id="course-examples" className={styles.section}>
            <h2>🎓 Course Content Examples</h2>
            
            <h3>Lesson Structure</h3>
            <div className={styles.example}>
              <pre className={styles.fullExample}><code>{`# Lesson 1: JavaScript Basics

## Learning Objectives
- Understand variables and data types
- Write your first JavaScript program
- Use console.log() for debugging

## Prerequisites
- Basic computer skills
- Text editor installed

## Content

### Variables
Variables store data that can be used later:

\`\`\`javascript
let name = "John";
let age = 25;
let isStudent = true;
\`\`\`

### Data Types
JavaScript has several data types:

| Type | Example | Description |
|------|---------|-------------|
| String | \`"Hello"\` | Text data |
| Number | \`42\` | Numeric data |
| Boolean | \`true\` | True/false values |

### Exercise
Create a program that:
1. Declares a variable with your name
2. Prints a greeting message
3. Shows your age

\`\`\`javascript
// Your code here
let myName = "Your Name";
console.log("Hello, " + myName);
\`\`\`

> **Note:** Remember to save your file with a \`.js\` extension!

## Resources
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://javascript.info)

---

**Next:** [Lesson 2: Functions and Scope](lesson2.md)`}</code></pre>
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className={styles.section}>
            <h2>✅ Best Practices</h2>
            
            <div className={styles.practiceGrid}>
              <div className={styles.practiceItem}>
                <h3>📝 Writing</h3>
                <ul>
                  <li>Use blank lines to separate sections</li>
                  <li>Keep lines under 80 characters when possible</li>
                  <li>Use descriptive link text</li>
                  <li>Always provide alt text for images</li>
                </ul>
              </div>
              
              <div className={styles.practiceItem}>
                <h3>🏗️ Structure</h3>
                <ul>
                  <li>Use heading hierarchy (H1 → H2 → H3)</li>
                  <li>Start with H1 for main title</li>
                  <li>Use H2 for major sections</li>
                  <li>Use H3 for subsections</li>
                </ul>
              </div>
              
              <div className={styles.practiceItem}>
                <h3>💻 Code</h3>
                <ul>
                  <li>Specify language for syntax highlighting</li>
                  <li>Use inline code for short snippets</li>
                  <li>Use code blocks for multi-line code</li>
                  <li>Add comments to explain complex code</li>
                </ul>
              </div>
              
              <div className={styles.practiceItem}>
                <h3>🎯 Accessibility</h3>
                <ul>
                  <li>Write descriptive alt text</li>
                  <li>Use proper heading structure</li>
                  <li>Avoid "click here" link text</li>
                  <li>Ensure good color contrast</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Quick Reference */}
          <section id="quick-reference" className={styles.section}>
            <h2>⚡ Quick Reference Cheat Sheet</h2>
            <div className={styles.cheatSheet}>
              <div className={styles.cheatColumn}>
                <h3>Text</h3>
                <code>**bold**</code><br/>
                <code>*italic*</code><br/>
                <code>~~strike~~</code><br/>
                <code>\`code\`</code>
              </div>
              <div className={styles.cheatColumn}>
                <h3>Lists</h3>
                <code>- bullet</code><br/>
                <code>1. numbered</code><br/>
                <code>- [x] task</code>
              </div>
              <div className={styles.cheatColumn}>
                <h3>Links</h3>
                <code>[text](url)</code><br/>
                <code>![alt](img)</code><br/>
                <code>&lt;url&gt;</code>
              </div>
              <div className={styles.cheatColumn}>
                <h3>Structure</h3>
                <code># H1</code><br/>
                <code>## H2</code><br/>
                <code>&gt; quote</code><br/>
                <code>---</code>
              </div>
            </div>
          </section>

        </main>

        <footer className={styles.footer}>
          <p>📖 Bookmark this page for quick markdown reference while creating courses!</p>
          <p><a href="/admin/course-builder">← Back to Course Builder</a></p>
        </footer>
      </div>
    </>
  );
}

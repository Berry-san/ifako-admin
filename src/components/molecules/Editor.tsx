import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  id?: string
  placeholder?: string
}

const Editor: React.FC<EditorProps> & { modules: any; formats: string[] } = ({
  value,
  onChange,
  id,
  placeholder,
}) => {
  const [theme, setTheme] = useState<string>('snow')

  const handleChange = (html: string) => {
    onChange(html)
  }

  const editorStyles: React.CSSProperties = {
    height: '150px',
    // marginBottom: '60px',
  }

  // Add media queries using a string template
  const responsiveStyles = `
    @media (max-width: 480px) { /* Phone */
      .quill-editor {
        padding-bottom: 1rem;
        margin-bottom: 110px;
      }
    }
    @media (min-width: 481px) and (max-width: 768px) { /* Tablet */
      .quill-editor {
      padding-bottom: 1.5rem;
        margin-bottom: 90px;
      }
    }
    @media (min-width: 769px) { /* PC */
      .quill-editor {
              padding-bottom: 1rem;
        margin-bottom: 60px;
      }
    }
  `

  return (
    <div>
      <style>{responsiveStyles}</style>
      <ReactQuill
        theme={theme}
        onChange={handleChange}
        value={value}
        id={id}
        modules={Editor.modules}
        formats={Editor.formats}
        bounds=".app"
        placeholder={placeholder}
        style={editorStyles}
        className="quill-editor"
      />
    </div>
  )
}

Editor.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
}

Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
]

export default Editor

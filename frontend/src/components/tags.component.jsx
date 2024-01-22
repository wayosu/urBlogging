import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag = ({ key, tagIndex, tag }) => {
  let {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);

  const addEditTable = (e) => {
    e.target.setAttribute("contentEditable", "true");
    e.target.focus();
  };

  const handleTagEdit = (e) => {
    if (e.keyCode == 13 || e.keyCode === 188) {
      e.preventDefault();

      let currentTag = e.target.innerText;
      tags[tagIndex] = currentTag;
      setBlog({ ...blog, tags });

      e.target.setAttribute("contentEditable", "false");
    }
  };

  const handleTagDelete = () => {
    tags = tags.filter((t) => t !== tag);
    setBlog({ ...blog, tags: tags });
  };

  return (
    <div
      key={key}
      className="
        relative 
        p-2 px-5 pr-10
        mt-2 mr-2 
        bg-white 
        rounded-full 
        inline-block 
        hover:bg-opacity-50
      "
    >
      <p
        onKeyDown={handleTagEdit}
        onClick={addEditTable}
        className="outline-none"
      >
        {tag}
      </p>
      <button
        onClick={handleTagDelete}
        className="
          mt-[2px] 
          rounded-full 
          absolute 
          right-3
          top-1/2 
          -translate-y-1/2
        "
      >
        <i className="fi fi-rr-cross-small text-xl pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;

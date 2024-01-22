import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";

const PublishForm = () => {
  let characterLimit = 200;
  let tagLimit = 10;

  let {
    blog,
    blog: { banner, title, tags, des },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogTitleChange = (e) => {
    let input = e.target;

    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDesChange = (e) => {
    let input = e.target;

    setBlog({ ...blog, des: input.value });
  };

  const handleBlogDesKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleBlogTopicsKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      let tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add max ${tagLimit} tags`);
      }

      e.target.value = "";
    }
  };

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />

        <button
          onClick={handleCloseEvent}
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
        >
          <i className="fi fi-rr-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1 ">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img
              src={banner}
              alt="banner"
            />
          </div>

          <h1 className="text-4xl font-medium mt-4 leading-tight line-clamp-2">
            {title}
          </h1>

          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>

        <div className="flex flex-col gap-8 border-grey lg:border-1 lg:pl-8 mt-9">
          <div>
            <p className="text-dark-grey mb-2">Blog Title</p>
            <input
              onChange={handleBlogTitleChange}
              defaultValue={title}
              type="text"
              className="input-box pl-4"
              placeholder="Blog Title"
            />
          </div>

          <div>
            <p className="text-dark-grey mb-2">
              Short description about your blog
            </p>
            <textarea
              onChange={handleBlogDesChange}
              onKeyDown={handleBlogDesKeyDown}
              maxLength={characterLimit}
              defaultValue={des}
              className="h-40 resize-none leading-7 input-box pl-4"
            ></textarea>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {characterLimit - des.length} characters left
            </p>
          </div>

          <div>
            <p className="text-dark-grey mb-2">
              Topics - ( Helps is searching and ranking your blog post )
            </p>
            <div className="relative input-box pl-2 py-2 pb-4">
              <input
                onKeyDown={handleBlogTopicsKeyDown}
                type="text"
                className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                placeholder="Add topics"
              />
              {tags.map((tag, i) => {
                return (
                  <Tag
                    key={i}
                    tagIndex={i}
                    tag={tag}
                  />
                );
              })}
            </div>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {tagLimit - tags.length} tags left
            </p>
          </div>

          <div>
            <button className="btn-dark px-8">Publish</button>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;

import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog-banner.png";
import { uploadImage } from "../common/firebase";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";

const BlogEditor = () => {
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holder: "textEditor",
        data: "",
        tools: tools,
        placeholder: "Start writing here...",
        logLevel: "ERROR",
      })
    );
  }, []);

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];

    // image size validation
    if (img.size > 1000000) {
      return toast.error("Image size must be less than 1MB");
    }

    if (img) {
      let loadingToast = toast.loading("Uploading...");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded Successfully");

            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
    }
  };

  const handleBannerError = (e) => {
    let img = e.target;

    img.src = defaultBanner;
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;

    setBlog({ ...blog, title: input.value });
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handlePublishEvent = () => {
    if (!banner.length) {
      return toast.error("Banner is required");
    }

    if (!title.length) {
      return toast.error("Title is required");
    }

    if (textEditor.isReady) {
      textEditor.save().then((data) => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("Write something in your blog to publish");
        }
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link
          to="/"
          className="flex-none w-10"
        >
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button
            onClick={handlePublishEvent}
            className="btn-dark py-2"
          >
            Publish
          </button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster containerStyle={{ top: 50 }} />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div
              className="
                relative 
                aspect-video 
                hover:opacity-80 
                bg-white 
                border-4 
                border-grey
              "
            >
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  className="z-20"
                  onError={handleBannerError}
                />
                <input
                  onChange={handleBannerUpload}
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                />
              </label>
            </div>

            <textarea
              onChange={handleTitleChange}
              onKeyDown={handleTitleKeyDown}
              placeholder="Blog Title"
              className="
                text-4xl 
                font-medium 
                w-full h-20 
                outline-none 
                resize-none 
                mt-10 
                leading-tight 
                placeholder:opacity-40
              "
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div
              id="textEditor"
              className="font-gelasio"
            ></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;

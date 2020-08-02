const populateFiles = (data, folder) => {
  html = "";
  data.forEach((element) => {
    html += `<li data-file="${element}" data-folder="${folder}" class="file"><span class="name">${element} </span><img  class="delete-file" src="./public/images/trash.svg" /></li>`;
  });
  document.querySelector(".folder-name #name").innerHTML = folder;
  document.querySelectorAll(".folder").forEach((element) => {
    element.classList.remove("selected");
  });
  document.querySelector(`#f-${folder}`).classList.add("selected");

  document.querySelector(".files").classList.remove("no-show");
  document.querySelector(".file-edit").classList.add("no-show");
  document.querySelector(".bread-crumb").classList.add("no-show");
  document.querySelector(".files").innerHTML = html;
  fileListener();
  fileTrashListener();
};

const folderTrashListener = () => {
  document.querySelectorAll(".delete-folder").forEach((element) => {
    element.addEventListener("click", (e) => {
      let { folder } = e.target.parentElement.dataset;
      Swal.fire({
        title: `Delete ${folder} and its contents?`,
        text: "You will not be able to reverse this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            let res = await fetch(`/delete-folder?folder=${folder}`);
            let data = await res.json();

            Swal.fire("Deleted!", "Folder has been deleted.", "success");
            if (data.status) {
              init();
            }
          } catch (e) {
            Swal.fire({ title: "An error occured", icon: "error" });
          }
        },
      });
    });
  });
};

const fileTrashListener = () => {
  document.querySelectorAll(".delete-file").forEach((element) => {
    element.addEventListener("click", (e) => {
      let { folder, file } = e.target.parentElement.dataset;
      Swal.fire({
        title: `Delete ${folder}/${file} ?`,
        text: "You will not be able to reverse this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            let res = await fetch(
              `/delete-note?folder=${folder}&filename=${file}`
            );
            let data = await res.json();
            if (data.status) {
              Swal.fire("Deleted!", status.message, "success");
              init();
            }
          } catch (e) {
            Swal.fire({ title: "An error occured", icon: "error" });
          }
        },
      });
    });
  });
};

const populateFolders = (data) => {
  html = "";
  data.forEach((element) => {
    html += `<li id="f-${element}" data-folder="${element}" class="folder"><span class="name">${element} </span><img  class="delete-folder" src="./public/images/trash.svg" /></li>`;
  });
  document.querySelector(".folders").innerHTML = html;
  folderListener();
  folderTrashListener();
  return data[0];
};

const fileListener = () => {
  document.querySelectorAll(".file .name").forEach((element) => {
    element.addEventListener("click", async (e) => {
      let { folder, file } = e.target.parentElement.dataset;
      let r = await fetch(`/read-note?folder=${folder}&filename=${file}`);
      let d = await r.text();
      document.querySelector("textarea").value = d;
      document.querySelector(".filename").innerHTML = file;
      document.querySelector(".files").classList.add("no-show");
      document.querySelector(".file-edit").classList.remove("no-show");
      document.querySelector(".bread-crumb").classList.remove("no-show");
    });
  });
};

const folderListener = () => {
  document.querySelectorAll(".folder .name").forEach((element) => {
    element.addEventListener("click", async (e) => {
      let { folder } = e.target.parentElement.dataset;
      let r = await fetch(`/get-notes?folder=${folder}`);
      let d = await r.json();
      populateFiles(d, folder);
    });
  });
};

const init = () => {
  fetch("/get-folders").then(async (res) => {
    let data = await res.json();
    let ff = populateFolders(data);

    let r = await fetch(`/get-notes?folder=${ff}`);
    let d = await r.json();
    populateFiles(d, ff);
  });
};
init();

const save_btn = document.querySelector(".save-btn");
const save = () => {
  saveNewFile();
};

const saveNewFile = () => {
  let folder = document.querySelector(".folder-name #name").innerHTML;
  let file = document.querySelector(".filename").innerHTML;
  let content = document.querySelector("textarea").value;
  fetch(`/save-note?folder=${folder}&filename=${file}&content=${content}`).then(
    async (res) => {
      let data = await res.json();
      Swal.fire({
        title: data.message,
        icon: data.status == true ? "success" : "error",
      });
    }
  );
};

save_btn.addEventListener("click", save);

const createNewFolder = () => {
  Swal.fire({
    title: "New Folder",
    input: "text",
    inputAttributes: {
      required: true,
      placeholder: "Folder name",
    },
    validationMessage: "Field is required",
    showCancelButton: true,
    confirmButtonText: "Save",
    showLoaderOnConfirm: true,
    preConfirm: async (input) => {
      try {
        let res = await fetch(`/create-folder?folder=${input}`);
        let data = await res.json();
        Swal.fire({
          title: data.message,
          icon: data.status == true ? "success" : "error",
        });
        if (data.status) {
          let res = await fetch(`/read-folder?folder=${input}`);
          let data = await res.json();
          init();
          setTimeout(() => {
            populateFiles(data, input);
          }, 500);
        }
      } catch (e) {
        Swal.fire({ title: "An error occured", icon: "error" });
      }
    },
    icon: "question",
  });
};

const createNewFile = () => {
  Swal.fire({
    title: "New Note",
    input: "text",
    inputAttributes: {
      required: true,
      placeholder: "Note name",
    },
    validationMessage: "Field is required",
    showCancelButton: true,
    confirmButtonText: "Save",
    showLoaderOnConfirm: true,
    preConfirm: async (input) => {
      try {
        let folder = document.querySelector(".folder-name #name").innerHTML;
        let res = await fetch(
          `/create-note?folder=${folder}&filename=${input}`
        );
        let data = await res.json();
        Swal.fire({
          title: data.message,
          icon: data.status == true ? "success" : "error",
        });
        if (data.status) {
          let res = await fetch(`/read-folder?folder=${folder}`);
          let data = await res.json();
          init();
          setTimeout(() => {
            populateFiles(data, folder);
          }, 100);
        }
      } catch (e) {
        Swal.fire({ title: "An error occured", icon: "error" });
      }
    },
    icon: "question",
  });
};

document.querySelectorAll(".new-folder").forEach((element) => {
  element.addEventListener("click", createNewFolder);
});

document.querySelector(".new-file").addEventListener("click", createNewFile);

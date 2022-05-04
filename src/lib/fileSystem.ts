/**
 * These filesystem handlers are independent of the CRDT used and provide
 * functions to use the browser platform for opening and saving files.
 */
export default {
  /**
   * Lets users pick a file path that the provided binary file content will
   * be written to.
   *
   * Uses the Filesystem Access browser API if available and falls back to
   * downloading a file if that's not available
   */
  saveFile: async (
    binary: Uint8Array,
    fileName: string = "New Board 1.fullscreen"
  ) => {
    if ("showSaveFilePicker" in window) {
      const newHandle = await (window as any).showSaveFilePicker();
      const writableStream = await newHandle.createWritable();
      await writableStream.write(binary);
      await writableStream.close();
    } else {
      const update = new Blob([binary]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(update);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  /**
   * Let's users pick a file path to open and returns its contents as an
   * `ArrayBuffer`.
   */
  openFile: async () => {
    return new Promise<Uint8Array>(async (resolve, reject) => {
      if ("showOpenFilePicker" in window) {
        const [fileHandle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: "Fullscreen Boards",
              accept: {
                "application/fullscreen": [".fullscreen"],
              },
            },
          ],
          multiple: false,
        });

        const bufferLike = await fileHandle.getFile();
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const update = new Uint8Array(event.target.result as ArrayBuffer);
          resolve(update);
        };
        fileReader.readAsArrayBuffer(bufferLike);
      } else {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "*.fullscreen";
        input.onchange = () => {
          const fileReader = new FileReader();
          fileReader.onload = (event) => {
            const update = new Uint8Array(event.target.result as ArrayBuffer);
            resolve(update);
          };
          fileReader.readAsArrayBuffer(input.files[0]);
        };
        input.click();
      }
    });
  },
};

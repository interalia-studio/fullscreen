export default {
  onSave: async (binary: any) => {
    if ("showSaveFilePicker" in window) {
      const newHandle = await (window as any).showSaveFilePicker();
      const writableStream = await newHandle.createWritable();
      await writableStream.write(binary);
      await writableStream.close();
    } else {
      const update = new Blob([binary]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(update);
      link.download = "my_first_board.fullscreen";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  onOpen: async () => {
    return new Promise<Uint8Array>(async (resolve, reject) => {
      if ("showSaveFilePicker" in window) {
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
            resolve(update)
          };
          fileReader.readAsArrayBuffer(input.files[0]);
        };
        input.click();
      }
    })
  }
}

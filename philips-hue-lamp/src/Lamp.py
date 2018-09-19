from tkinter import *

OFF_SIZE = {
    "width": 70,
    "height": 70
}

ON_SIZE = {
    "width": 500,
    "height": 500
}


class Lamp:
    def __init__(self, title, client_socket):
        self.cliet_socket = client_socket
        self.root = Tk()
        self.root.title(title)
        self.root.geometry("+400+250")
        self.root.configure({
            "background": "#ff0000",
            "width": OFF_SIZE['width'],
            "height": OFF_SIZE['height']
        })
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        # socket event handlers
        self.cliet_socket.add_new_event('value', self.on_value_response)
        self.cliet_socket.add_new_event('color', self.on_color_response)

    def on_value_response(self, value):
        print("Value lamp = ", value)
        if value == True:
            self.change_size(dimensions=ON_SIZE)
        elif value == False:
            self.change_size(dimensions=OFF_SIZE)

    def on_color_response(self, color):
        print("Color lamp = ", color)
        self.root.configure({
            "background": color
        })

    def change_size(self, event=None, dimensions=OFF_SIZE):
        print(event)
        self.root.configure({
            "width": dimensions['width'],
            "height": dimensions['height']
        })

    def on_closing(self):
        print("Closing lamp")
        self.cliet_socket.emit_close()
        self.cliet_socket.close()
        self.root.quit()
        exit(0)

    def mainloop(self):
        self.root.mainloop()

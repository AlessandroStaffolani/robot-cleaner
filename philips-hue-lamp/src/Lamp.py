from tkinter import *
from .ClientSocketIO import ClientSocketIO

OFF_SIZE = {
    "width": 70,
    "height": 70
}

ON_SIZE = {
    "width": 500,
    "height": 500
}


class Lamp:
    def __init__(self, title, host, port):
        self.root = Tk()
        self.root.title(title)
        self.root.geometry("+400+250")
        self.root.configure({
            "background": "#ff0000",
            "width": OFF_SIZE['width'],
            "height": OFF_SIZE['height']
        })
        self.root.bind("<<SwitchOff>>", lambda e: self.change_size(e, OFF_SIZE))
        self.root.bind("<<SwitchOn>>", lambda e: self.change_size(e, ON_SIZE))
        client_socket = ClientSocketIO(host, port)
        client_socket.connect()
        client_socket.wait()
        self.root.mainloop()

    def change_size(self, event, dimensions):
        print(event)
        self.root.configure({
            "width": dimensions['width'],
            "height": dimensions['height']
        })


# from tkinter import *
#
# OFF_SIZE = {
#     "width": 70,
#     "height": 70
# }
#
# ON_SIZE = {
#     "width": 500,
#     "height": 500
# }
#
#
# class Lamp:
#
#     def __init__(self, title):
#         self.root = Tk()
#         self.root.title(title)
#         self.root.geometry("+400+250")
#         self.root.configure({
#             "background": "#ff0000",
#             "width": OFF_SIZE['width'],
#             "height": OFF_SIZE['height']
#         })
#         self.root.bind("<<SwitchOff>>", lambda e: self.change_size(e, OFF_SIZE))
#         self.root.bind("<<SwitchOn>>", lambda e: self.change_size(e, ON_SIZE))
#         mainloop()
#
#     def change_size(self, event, dimensions):
#         print(event)
#         self.root.configure({
#             "width": dimensions['width'],
#             "height": dimensions['height']
#         })
#
#     def generate_event(self, eventName):
#         self.root.event_generate("<<SwitchOff>>", when="tail")


#lamp = Lamp('Philips hue lamp')
#lamp.generate_event("<<SwitchOff>>")
#mainloop()

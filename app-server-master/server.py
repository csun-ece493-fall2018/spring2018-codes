"""
 * California State University Northridge
 * ECE 493 Senior Design
 * Project: Ultrasonic radar
 * Participants: Hambartzum Gamburian, Giovanni Alonzo, Saba Janamian, Hamed Seyedroudbari, Andrew Zaragoza, Xiaoao Feng
 * Advisor: Dr. Shahnam Mirzaei
 * Code Description: A simple tornado web server to listen to both http requests and websocket connection
 * Author: Saba Janamian
 * Version: 1.0
 * Date: 3/7/2018
 """
from tornado import websocket, web, ioloop
import json

cl = []


class IndexHandler(web.RequestHandler):
    def get(self):
        self.render("../app-client/index.html")


class RadarGraphHandler(web.RequestHandler):
    def get(self):
        self.render("../app-client/radar.html")


class SocketHandler(websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        if self not in cl:
            cl.append(self)

    def on_close(self):
        if self in cl:
            cl.remove(self)


class ApiHandler(web.RequestHandler):

    @web.asynchronous
    def get(self, *args):
        self.finish()
        id = self.get_argument("id")
        value = self.get_argument("value")
        data = {"id": id, "value" : value}
        data = json.dumps(data)
        for c in cl:
            c.write_message(data)

    @web.asynchronous
    def post(self):
        pass


app = web.Application([
    (r'/', IndexHandler),
    (r'/ws', SocketHandler),
    (r'/api', ApiHandler),
    (r'/(radar.html)', web.StaticFileHandler, {'path': './'}),
    (r'/(socket.io)', web.StaticFileHandler, {'path': './'}),
    (r'/(sketch.js)', web.StaticFileHandler, {'path': './'}),
    (r'/(favicon.ico)', web.StaticFileHandler, {'path': '../'}),
    (r'/(rest_api_example.png)', web.StaticFileHandler, {'path': './'}),
])

if __name__ == '__main__':
    app.listen(8888)
    ioloop.IOLoop.instance().start()
package org.wdc.web.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/")
public class ViewsController {
    @RequestMapping(method = RequestMethod.GET, produces = "text/html")
    public ResponseEntity<FileSystemResource> home() {
        FileSystemResource fileSystemResource =
                new FileSystemResource("src/main/webapp/build/index.html");
        return new ResponseEntity<>(fileSystemResource, HttpStatus.OK);
    }
}

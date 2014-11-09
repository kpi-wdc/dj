package org.wdc.web.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/apps")
public class AppConfigurationUpdateController {
    @RequestMapping(value="{name}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ResponseEntity<FileSystemResource> getJSON(@PathVariable String name) {
        FileSystemResource fileSystemResource =
                new FileSystemResource("src/main/webapp/resources/apps/" + name + ".json");
        return new ResponseEntity<>(fileSystemResource, HttpStatus.OK);
    }
}
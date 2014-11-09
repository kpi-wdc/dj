package org.wdc.web.controller;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;

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

    @ResponseBody
    @RequestMapping(value = "/app.json", method = RequestMethod.PUT)
    public void updateConfiguration(@RequestBody String body) {
        try (PrintWriter out = new PrintWriter("src/main/webapp/resources/apps/app.json")) {
            // convert to pretty view of the json
            ObjectMapper mapper = new ObjectMapper();
            Object json = mapper.readValue(body, Object.class);
            String prettyBody = mapper.writerWithDefaultPrettyPrinter().
                    writeValueAsString(json);
            out.print(prettyBody);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
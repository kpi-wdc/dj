package org.wdc.web.controller;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.AbstractResource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.wdc.dao.data.AppConfigDao;
import org.wdc.domain.data.AppConfig;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Controller
@RequestMapping("/apps")
public class AppConfigurationUpdateController {
    @Autowired
    private AppConfigDao appConfig;

    public AppConfigDao getAppConfig() {
        return appConfig;
    }

    public void setAppConfig(AppConfigDao appConfig) {
        this.appConfig = appConfig;
    }

    @RequestMapping(value="{name}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ResponseEntity<AbstractResource> getJSON(@PathVariable String name) {
        AbstractResource response = null;
        List<AppConfig> list;
        if (name.equals("app")) {
            try {
                list = appConfig.list();
                if (list.isEmpty()) {
                    byte[] lines = Files.readAllBytes(Paths.get("src/main/webapp/resources/apps/"
                                                        + name + ".json"));
                    appConfig.update(new AppConfig(lines));
                    response = new ByteArrayResource(lines);
                } else {
                    response = new ByteArrayResource(((AppConfig) list.toArray()[0]).getData());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            response =
                    new FileSystemResource("src/main/webapp/resources/apps/" + name + ".json");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
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
            appConfig.update(new AppConfig(prettyBody.getBytes(Charset.forName("UTF-8"))));
            out.print(prettyBody);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

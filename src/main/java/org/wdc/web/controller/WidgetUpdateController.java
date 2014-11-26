package org.wdc.web.controller;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.LinkedHashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Controller
@RequestMapping(value = "/widget")
public class WidgetUpdateController {
    private static final String[] EXT_WHITELIST = {".js", ".png", ".css", ".html", ".txt", ".json"};
    private static final int WIDGET_HTML = 0;
    private static final int WIDGET_JS = 1;
    private static final int ICON_PNG = 2;

    // TODO: move to servlet environment constants
    private static final String WIDGETS_JSON_PATH = "src/main/webapp/resources/widgets/widgets.json";

    @RequestMapping(value = "{widgetName}", method = RequestMethod.POST)
    @ResponseBody
    @SuppressWarnings("unchecked")
    public ResponseEntity<String> updateWidget(@PathVariable String widgetName,
                                               @RequestParam("file") MultipartFile file) {
        ObjectMapper mapper = new ObjectMapper();
        LinkedHashMap<String, LinkedHashMap<String, Object>> widgets = null;

        Process gulpBuild = null;

        // parent directory for all files of the widget
        String destination = "resources/widgets" + widgetName;

        // decompress zip archive to the correct directory
        try (InputStream is = file.getInputStream();
             ZipInputStream zipInputStream = new ZipInputStream(is)) {

            // object representation of widgets.json file
            widgets = mapper.readValue(IOUtils.toString(new FileInputStream
                    (WIDGETS_JSON_PATH)), LinkedHashMap.class);

            // current widget of widget.json file
            LinkedHashMap<String, Object> widget = widgets.get(widgetName);

            boolean[] widgetFileExistence = new boolean[3];

            ZipEntry entry;

            while ((entry = zipInputStream.getNextEntry()) != null) {
                File entryDestination = new File(destination, entry.getName());
                entryDestination.getParentFile().mkdirs();
                if (entry.isDirectory()) {
                    entryDestination.mkdirs();
                } else {
                    try (OutputStream out = new FileOutputStream(entryDestination)) {
                        IOUtils.copy(zipInputStream, out);
                        out.close();
                    }

                    // check whether the file is allowed
                    validateFile(entry.getName(), widgetFileExistence);
                }
            }
            // change widget fields accordingly
            alterWidgetFields(widget, widgetFileExistence);

            // merge changes to widgets.json file
            mapper.writerWithDefaultPrettyPrinter().
                    writeValue(new FileOutputStream(WIDGETS_JSON_PATH), widgets);

            // TODO: if needed add Windows process
            gulpBuild = new ProcessBuilder("gulp", "build")
                    .directory(new File("src/main/webapp/"))
                    .start();
        } catch (Exception e) {
            e.printStackTrace();

            // delete directory if its contents weren't created normally
            try {
                FileUtils.deleteDirectory(new File(destination));
            } catch (IOException cantDeleteDirEx) {
                cantDeleteDirEx.printStackTrace();
            }
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        } finally {
            // kill process if something went wrong
            if (gulpBuild != null) gulpBuild.destroy();
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * Method validates filename (it must have extension in EXT_WHITELIST array).
     * If validation fails, it throws IllegalArgumetException
     * @param fileName name of the file to validate and update
     * @param widgetFileExistence array that indicates existence of special files
     * @throws java.lang.IllegalArgumentException when validation fails
     */
    private void validateFile(String fileName, boolean[] widgetFileExistence) {
        for (String allowedExtension : EXT_WHITELIST) {
            if (fileName.endsWith(allowedExtension)) {
                switch (fileName) {
                    case "widget.js": widgetFileExistence[WIDGET_JS] = true; break;
                    case "widget.html": widgetFileExistence[WIDGET_HTML] = true; break;
                    case "icon.png": widgetFileExistence[ICON_PNG] = true; break;
                }
                return;
            }
        }

        throw new IllegalArgumentException("File extension is forbidden");
    }

    /**
     * Change fields of current widget to true, if some of the files do not exist
     * @param widget current widget to change
     * @param widgetFileExistence array that indicates file existence for the widget
     */
    private void alterWidgetFields(LinkedHashMap<String, Object> widget, boolean[] widgetFileExistence) {
        if (!widgetFileExistence[WIDGET_HTML]) widget.put("nohtml", true);
        if (!widgetFileExistence[WIDGET_JS]) widget.put("nojs", true);
        if (!widgetFileExistence[ICON_PNG]) widget.put("noicon", true);
    }
}
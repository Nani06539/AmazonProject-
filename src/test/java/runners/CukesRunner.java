package runners;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.AfterClass;
import org.junit.runner.RunWith;


@RunWith(Cucumber.class)
@CucumberOptions(
        plugin = {"html:target/cucumber-reports", "json:target/cukesreport.json"},
        features = "src/test/resources/amazon.features/",
        glue = "amazon_step_definitions",
        dryRun =false,
        tags = "@amazon"
)


public class CukesRunner {

}

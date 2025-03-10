document.addEventListener("DOMContentLoaded", () => {
    const countryInput = document.getElementById("country");
    const submitButton = document.getElementById("btn");
    const capital = document.getElementById("capital");
    const population = document.getElementById("population");
    const regionEl = document.getElementById("region");
    const flag = document.getElementById("flag");
    const borderingCountries = document.getElementById("borderingCountriesList");

    submitButton.addEventListener("click", () => {
        const countryName = countryInput.value.trim();

        if (countryName.length < 4) {
            alert("Please enter a valid country name.");
            return;
        }

        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Country not found.");
                }
                return response.json();
            })
            .then(data => {
                const country = data[0];
                console.log(country)
                capital.textContent= country.capital[0];
                population.textContent= country.population.toLocaleString();
                regionEl.textContent= country.region;
                flag.src= country.flags.png;
                flag.style.display= "block"; 
                borderingCountries.textContent= ""; 
                const borders= country.borders||[];

                if (borders.length> 0) {
                    borders.forEach(code=> {
                        fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                            .then(res => res.json())
                            .then(borderCountry=> {
                                const listItem= document.createElement("li");
                                const countryName= document.createElement("p");
                                countryName.textContent= borderCountry[0].name.common;
                                const borderFlag= document.createElement("img");
                                borderFlag.src= borderCountry[0].flags.png;
                                borderFlag.alt= `${borderCountry[0].name.common} Flag`;
                                listItem.appendChild(countryName);
                                listItem.appendChild(borderFlag);
                                borderingCountries.appendChild(listItem);
                            })
                            .catch(error => console.error("Error fetching border country:", error));
                    });
                } else {
                    const noBordersItem = document.createElement("li");
                    noBordersItem.textContent = "No bordering countries.";
                    borderingCountries.appendChild(noBordersItem);
                }
            })
            .catch(error => {
                alert(error.message);
            });
    });
});

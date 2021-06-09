<!--
author:   Daniel Hoffmann

version:  0.0.1

language: en

narrator: US English Female

onload

window.submit = function(id1, id2) {
  alert(`id: ${document.getElementById(id1).value}\n-----------\n${document.getElementById(id2).value}`)
}

@end

-->

# Test-Kurs zum Ausprobieren

Bitte Geben Sie Ihre Foo-Daten ein

<script input="text" input-always-active modify="false">
window.foo = "@input";
" "
</script>
<script input="button" modify="false">
if(window.foo == "") "Bestätigen"
else
{
  //Aktion
  alert("Ihr Foo: " + window.foo);
  "Erfolg"
}

</script>

# Test 2
Bitte Geben Sie Ihre Foo-Daten ein

<script input="search" value="" input-active>
let str = "@input"
"Bestätigen"

if(str != "")
{alert(str);
"Erfolg"
}

</script>

# Test 32

<label for="fname">First name:</label>
<br>
<input type="text" id="fname" name="fname" value="John"><br>
<label for="lname">Last name:</label>
<br>
<input type="text" id="lname" name="lname" value="Doe"><br><br>
<input type="button" value="Submit" onclick="submit('fname', 'lname')">

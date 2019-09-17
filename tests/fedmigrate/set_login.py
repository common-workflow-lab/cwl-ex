import json
import sys

f = open(sys.argv[1], "r+")
j = json.load(f)
j["Clusters"][sys.argv[2]]["Login"] = {"LoginCluster": sys.argv[3]}
f.seek(0)
json.dump(j, f)

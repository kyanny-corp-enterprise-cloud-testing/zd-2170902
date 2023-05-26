require 'yaml'

wiki_dir = ARGV.first || 'wiki'

home = []
index = []

p Dir.pwd

Dir.chdir(wiki_dir) do 
  system 'ls -lah .'
  Dir.glob('*.md').each do |path|
    name = File.basename(path, File.extname(path))
    home << "- [[#{name}]]"
    index << "- [#{name}](https://github.com/kyanny-corp-enterprise-cloud-testing/zd-2170902/wiki/#{name})"

    yaml_data = ""
    File.readlines(path).each do |line|
      if line =~ /---/ ... line =~ /---/
        yaml_data << line
      end
    end
    yaml = YAML.load(yaml_data)
    pp yaml
    unless yaml.nil?
      keywords = yaml['keywords']
      home << "  - keywords: " + keywords.join(", ")
      index << "  - keywords: " + keywords.join(" , ")
    end
  end
end

puts home.join("\n")
puts index.join("\n")

File.write("#{wiki_dir}/Home.md", home.join("\n"))
File.write("./index.md", index.join("\n"))

import {interval, Subscription} from 'rxjs';
import {map, takeWhile, tap} from "rxjs/operators";

export interface Topic {
  name: string;
  words: string[];
}

export class TopicsController {
  private readonly arguments = ["-agentlib:libname[=options]",
    "-agentpath:pathname[=options]",
    "--class-path classpath,",
    "-classpath classpath",
    "-cp classpath",
    "--disable-@files",
    "--enable-preview",
    "--module-path modulepath...",
    "--upgrade-module-path modulepath...",
    "--add-modules module",
    "--list-modules",
    "--describe-module module_name",
    "--dry-run",
    "--validate-modules",
    "-Dproperty=value",
    "-disableassertions",
    "-disablesystemassertions",
    "-enableassertions",
    "-enablesystemassertions",
    "-help",
    "--help",
    "-javaagent",
    "--show-version",
    "-showversion",
    "--show-module-resolution",
    "-splash:imagepath",
    "-verbose:class",
    "-verbose:gc",
    "-verbose:jni",
    "-verbose:module",
    "--version",
    "-version",
    "-X",
    "--help-extra"];
  private readonly collections = [
    'Map',
    'List',
    'Stack',
    'Vector',
    'Set',
    'Queue',
    'Iterator',
    'Iterable',
    'NavigableSet',
    'TreeSet',
    'ArrayDeque',
    'PriorityQueue',
    'ArrayList',
    'LinkedList',
    'RandomAccess',
    'sort',
    'binarySearch',
    'addAll',
    'contains',
    'size',
    'Red-Black tree',
    'thread safe classes',
    'ArrayBlockingQueue',
    'ConcurrentSkipListMap',
    'SynchronousQueue',
    'LinkedTransferQueue',
    'CopyOnWriteArrayList',
    'ConcurrentHashMap',
    'List.of(...)',
    'Collections.singleton(...)'
  ];
  private readonly garbageCollectors = [
    "Serial",
    "Parrallel",
    "G1",
    "Code Cache",
    "Stop the world",
    "Unreferenced objects",
    "Tenuring threshold",
    "ZGC",
    "CMS",
    "Shenandoah",
    "Full GC",
    "object promotion",
    "remembered set",
    "safepoint",
    "metaspace",
    "allocation failure"
  ];
  private readonly keywords = [
    'abstract',
    'continue',
    'for',
    'new',
    'switch',
    'assert',
    'default',
    'package',
    'synchronized',
    'boolean',
    'do',
    'if',
    'private',
    'this',
    'break',
    'double',
    'implements',
    'protected',
    'throw',
    'byte',
    'else',
    'import',
    'public',
    'throws',
    'case',
    'enum',
    'instanceof',
    'return',
    'transient',
    'catch',
    'extends',
    'int',
    'short',
    'try',
    'char',
    'final',
    'interface',
    'static',
    'void',
    'class',
    'finally',
    'long',
    'strictfp',
    'volatile',
    'const',
    'float',
    'native',
    'super',
    'while'
  ];
  private readonly openSource = [
    'guava',
    'mahout',
    'hadoop',
    'lucene',
    'netty',
    'Jenkins',
    'Mockito',
    'spark',
    'storm',
    'ZooKeeper',
    'jackson',
    'trove',
    'kryo',
    'Hibernate',
    'ASM',
  ];
  private readonly packages = [
    'java.base',
    'java.compiler',
    'java.datatransfer',
    'java.desktop',
    'java.instrument',
    'java.logging',
    'java.management',
    'java.management.rmi',
    'java.naming',
    'java.net.http',
    'java.prefs',
    'java.rmi',
    'java.scripting',
    'java.se',
    'java.security.jgss',
    'java.security.sasl',
    'java.smartcardio',
    'java.sql',
    'java.sql.rowset',
    'java.transaction.xa',
    'java.xml',
    'java.xml.crypto',
    'jdk.accessibility',
    'jdk.attach',
    'jdk.charsets',
    'jdk.compiler',
    'jdk.crypto.cryptoki',
    'jdk.crypto.ec',
    'jdk.dynalink',
    'jdk.editpad',
    'jdk.hotspot.agent',
    'jdk.httpserver',
    'jdk.jartool',
    'jdk.javadoc',
    'jdk.jcmd',
    'jdk.jconsole',
    'jdk.jdeps',
    'jdk.jdi',
    'jdk.jdwp.agent',
    'jdk.jfr',
    'jdk.jlink',
    'jdk.jshell',
    'jdk.jsobject',
    'jdk.jstatd',
    'jdk.localedata',
    'jdk.management',
    'jdk.management.agent',
    'jdk.management.jfr',
    'jdk.naming.dns',
    'jdk.naming.rmi',
    'jdk.net',
    'jdk.pack',
    'jdk.rmic',
    'jdk.scripting.nashorn',
    'jdk.sctp',
    'jdk.security.auth',
    'jdk.security.jgss',
    'jdk.xml.dom',
    'jdk.zipfs',
  ];
  private readonly threadSafe = [
    'CompletableFuture',
    'CountDownLatch',
    'CyclicBarrier',
    'Phaser',
    'Semaphore',
    'ArrayBlockingQueue',
    'ConcurrentSkipListMap',
    'SynchronousQueue',
    'LinkedTransferQueue',
    'CopyOnWriteArrayList',
    'ConcurrentHashMap',
  ];
  private readonly tools = [
    'jaotc',
    'jar',
    'jarsigner',
    'javac',
    'javadoc',
    'javap',
    'jcmd',
    'jconsole',
    'jdb',
    'jdeprscan',
    'jdeps',
    'jfr',
    'jhsdb',
    'jinfo',
    'jjs',
    'jlink',
    'jmap',
    'jmod',
    'jps',
    'jrunscript',
    'jshell',
    'jstack',
    'jstat',
    'jstatd',
    'keytool',
    'pack200',
    'rmic',
    'rmid',
    'rmiregistry',
    'serialver',
    'unpack200',
  ];

  free: number[];//индексы неиспользованных тем
  topics: Topic[] = [
    {name: "Java Arguments", words: this.arguments},
    {name: "Java Collections", words: this.collections},
    {name: "Garbage Collectors", words: this.garbageCollectors},
    {name: "Java Keywords", words: this.keywords},
    {name: "Java Open Source", words: this.openSource},
    {name: "Java Packages", words: this.packages},
    {name: "Java Thread Safe", words: this.threadSafe},
    {name: "Java Tools", words: this.tools}
  ];
  current: Topic;
  currentSubscription: Subscription;
  private readonly onChangeTopic: (topicName: string) => void;

  constructor(
    onChangeTopic: (topicName: string) => void
  ) {
    this.onChangeTopic = onChangeTopic;
    this.initTopics();
  }

  public initTopics(): void {
    this.free = new Array<number>(this.topics.length);
    for (let i = 0; i < this.topics.length; i++) {
      this.free[i] = i;
    }
    this.current = this.getNewUnusedTopic();
    console.log(`first topic ${this.current}`);
  }

  generateTopics() {
    console.log("start generate topics");
    this.currentSubscription = interval(20 * 1000)
      .pipe(
        tap(num => console.log(`CHANGE TOPIC ${num}`)),
        takeWhile(state => this.free.length !== 0),
        map(() => {
          return this.getNewUnusedTopic();
        }),
        tap(topic => console.log(`new set topic ${topic.name}`))
      )
      .subscribe(topic => {
        this.current = topic;
        this.onChangeTopic(topic.name);
      });
  }

  public stopGenerateTopics() {
    if (this.currentSubscription !== null && !this.currentSubscription.closed) {
      console.log('stop generate topics');
      this.currentSubscription.unsubscribe();
    }
  }

  public getRandomWordFromCurrentTopic(): string {
    const length = this.current.words.length;
    const index = Math.floor(Math.random() * length);
    return this.current.words[index];
  }

  public getRandomWordFromNotCurrentTopics(): string {
    const nonCurrent: Topic[] = this.topics.filter(topic => topic.name !== this.current.name);
    const topicIndex = Math.floor(Math.random() * nonCurrent.length);
    const words = nonCurrent[topicIndex].words;
    const wordIndex = Math.floor(Math.random() * words.length);
    return words[wordIndex];
  }

  public getCurrentTopic() {
    return this.current;
  }

  private getNewUnusedTopic(): Topic | null {
    const freeCount = this.free.length;
    if (freeCount > 0) {
      const randIndex = Math.floor(Math.random() * freeCount);
      const index = this.free[randIndex];
      this.free.splice(randIndex, 1);
      return this.topics[index];
    }
    return null;
  }

  getNewWord() {
    const goodOrBad = Math.random() >= 0.4;
    return goodOrBad ? this.getRandomWordFromCurrentTopic() : this.getRandomWordFromNotCurrentTopics();
  }
}
